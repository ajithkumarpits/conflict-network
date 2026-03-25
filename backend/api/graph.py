import os
import logging
import json
import anyio
import pandas as pd
from fastapi import APIRouter, status
from utils import actor_functions as af
from utils import helper_functions as hf
from utils.peace_functions import get_mediation_links_and_nodes
from utils.redis import RedisClient
from utils.responses import success_response, error_response
from config.specifications import (
    DATA_SIDE_A_COL,
    DATA_SIDE_B_COL,
    DATA_EVENT_DATE_DT_COL,
    DATA_NOT_FOUND,
    INTERNAL_SERVER_ERROR_MSG,
    LOG_CSV_FILE_MSG,
    BY_COUNTRY_DIR,
    FRONTEND_EVENT_COLS,
    DATA_DATE_START_COL,
    EVENT_TYPE_COLOURS as ETC_PATH,
    LINK_TYPE_COLOURS as LTC_PATH,
    BACKGROUND_XLSX_FILE,
    MULTIPLE_SEPARATOR,
    DATA_ID_COL,
    DATA_EVENT_TYPE_COL,
    COUNTRIES_GW_FILE
)

router = APIRouter()
logger = logging.getLogger("conflict_network")
redis_client = RedisClient()

# Hardcoded data path for standalone library
LIB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(LIB_DIR, "data")

@router.get("/get-event-graph")
async def get_event_graph(start, end, gw_number, include_peace_data: bool = False):
    """
    Get the computed event graph from the data set.
    """
    try:
        # 1. Generate a unique cache key for this specific request
        cache_key = f"event_graph_{gw_number}_{start}_{end}_{include_peace_data}"
        
        # 2. Check if the result is already in Redis
        cached_graph = redis_client.get_json(cache_key)
        if isinstance(cached_graph, dict) and "error" not in cached_graph:
            logger.info(f"Returning cached graph for {cache_key}")
            return success_response(
                data=cached_graph,
                message="Successfully retrieved the event graph (from cache).",
                status_code=status.HTTP_200_OK,
            )

        logger.info(f"Cache miss for {cache_key}. Computing graph...")
        logger.info(LOG_CSV_FILE_MSG)
        events_filename = os.path.join(DATA_DIR, BY_COUNTRY_DIR, f"ged_{gw_number}.csv")
        if not os.path.exists(events_filename):
            return success_response(data=None, message=DATA_NOT_FOUND)

        event_dataset = await anyio.to_thread.run_sync(hf.prepare_df, events_filename)
        small_df = await anyio.to_thread.run_sync(hf.df_in_period, event_dataset, start, end)
        small_df = small_df.fillna("-")

        # get all actors
        actors = await anyio.to_thread.run_sync(hf.get_actors, gw_number)
        all_actors = await anyio.to_thread.run_sync(af.get_all_actors_list, small_df, DATA_SIDE_A_COL, DATA_SIDE_B_COL)
        
        # for all actor names that are found in relevant data frame, get the corresponding actor instance
        actor_items = [
            actor for actor in actors.actors if actor.originalName in all_actors
        ]

        # create nodes list
        nodes = [
            {"actor_id": actor.id, "actor_name": actor.originalName}
            for actor in actor_items
        ]

        # create links list
        links = af.getLinksList(small_df, nodes)

        # optionally integrate peace/mediation data
        if include_peace_data:
            new_nodes, mediation_links = await anyio.to_thread.run_sync(
                get_mediation_links_and_nodes, int(gw_number), nodes, links, start, end, actors
            )
            nodes.extend(new_nodes)
            links.extend(mediation_links)

        # count how often an actor appears in reports
        for actor in nodes:
            actor["appearance"] = len(
                set(
                    [
                        id
                        for reslist in [
                            link["reports"]
                            for link in links
                            if (actor["actor_id"] in [link["target"], link["source"]])
                        ]
                        for id in reslist
                    ]
                )
            )

        # count maximum number of reports in a link
        max_link = max([len(link["reports"]) for link in links], default=1)

        # build result
        max_appearance = max([node["appearance"] for node in nodes], default=0)
        graph = dict(
            nodes=nodes, links=links, max_node=max_appearance, max_link=max_link
        )

        # 3. Store the computed result in Redis for future requests (expiry: 1 month)
        redis_client.set_json(cache_key, graph, expiry=2592000)

        return success_response(
            data=graph,
            message="Successfully retrieved the event graph.",
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        logger.exception(f"Error in get_event_graph: {e}")
        return error_response(
            message=INTERNAL_SERVER_ERROR_MSG,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@router.get("/get-filtered-by-actor-names")
async def get_by_actor_name(names, start, end, gw_number):
    """
    Filter the data set based on one or multiple actor name(s).

    Args:
        names (list(str)):  The relevant actor name(s).
        start (str):        The start date of the relevant period.
        end (str):          The end date of the relevant period.
        gw_number (int):    The Gleditsch + Ward number of the relevant country.

    Returns:
        dict: The relevant part of the data set.
    """
    try:

        cache_key = f"ged_{gw_number}.csv"
        cached_data = redis_client.get_value(cache_key)
        if cached_data.get("value") is not None:
            data = json.loads(cached_data.get("value"))
            event_dataset = pd.read_json(data, orient="records")
            event_dataset[DATA_EVENT_DATE_DT_COL] = pd.to_datetime(event_dataset[DATA_DATE_START_COL])

        else:
            logger.info(LOG_CSV_FILE_MSG)
            events_filename = os.path.join(DATA_DIR, BY_COUNTRY_DIR, f"ged_{gw_number}.csv")
            if not os.path.exists(events_filename):
                return success_response(
                    data=None,
                    message=DATA_NOT_FOUND,
                    status_code=status.HTTP_200_OK,
                )
            event_dataset = await anyio.to_thread.run_sync(hf.prepare_df, events_filename)
        small_df = await anyio.to_thread.run_sync(hf.df_in_period, event_dataset, start, end)
        small_df = small_df.fillna("-")
        names = names.split(",")
        small_df = af.getRelevantCombined(small_df, names)
        small_df = small_df[FRONTEND_EVENT_COLS.keys()].rename(
            columns=FRONTEND_EVENT_COLS
        )

        return success_response(
            data=small_df.to_dict(orient="records"),
            message="Successfully filtered by actor name(s).",
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        logger.error(f"Error Results:{e}")
        return error_response(
            message=INTERNAL_SERVER_ERROR_MSG,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )