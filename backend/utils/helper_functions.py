import pandas as pd
import json
import os
from models.actor_pool import ActorPool
from . import actor_functions as af
from config.specifications import (
    DATA_DATE_START_COL,
    DATA_EVENT_DATE_DT_COL,
    ACTOR_REL,
    DATA_SIDE_A_COL,
    ACTOR_REL,
    DATA_SIDE_A_COL,
    DATA_SIDE_B_COL,
    ACTORS_FILE,
    BY_COUNTRY_DIR,
    ACTORS_DIR
)

def prepare_df(filename):
    dataset = pd.read_csv(filename, low_memory=False)
    dataset = dataset.fillna("-")
    dataset[DATA_EVENT_DATE_DT_COL] = pd.to_datetime(dataset[DATA_DATE_START_COL])
    return dataset

def load_actor_df(filename):
    if not os.path.exists(filename):
        return pd.DataFrame(columns=ACTOR_REL)
    actorset = pd.read_excel(filename)
    actorset = actorset[ACTOR_REL]
    return actorset

def df_in_period(df, start, end):
    return df.loc[
        (df[DATA_EVENT_DATE_DT_COL] >= pd.to_datetime(start))
        & (df[DATA_EVENT_DATE_DT_COL] <= pd.to_datetime(end))
    ]

def read_actors(filename):
    pool = ActorPool()
    if not os.path.exists(filename):
        return pool
    with open(file=filename, mode="r") as data_file:
        actors_from_json = json.load(data_file)
    for item in actors_from_json:
        pool.addBaseActor(
            item["id"],
            item["dataBasedName"],
            item["actorType"],
            item["eventReportIds"],
            item["eventTypeSummary"],
            item["eventTypes"],
            item["links"],
            item["collaborations"],
            item["oppositions"],
        )
    return pool

def create_actors(gw_number, data_dir=None, actor_file=None):
    if data_dir is None:
        data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    if actor_file is None:
        actor_file = os.path.join(data_dir, ACTORS_FILE)
        
    events_filename = os.path.join(data_dir, BY_COUNTRY_DIR, f"ged_{gw_number}.csv")
    if not os.path.exists(events_filename):
        return ActorPool()
    
    event_dataset = prepare_df(events_filename)
    actor_dataset = load_actor_df(actor_file)

    pool = ActorPool()
    all_actors = af.get_all_actors_list(event_dataset, DATA_SIDE_A_COL, DATA_SIDE_B_COL)
    event_summaries = [af.getEventTypeSummary(event_dataset, name) for name in all_actors]

    for idx, actorName in enumerate(all_actors):
        actorID = af.getActorId(actor_dataset, actorName)
        eventReportIds = af.getEventReportIds(event_dataset, actorName)
        eventTypes, eventTypeSummary = event_summaries[idx]
        actorType = af.getActorType(event_dataset, actor_dataset, actorName)
        links, collaborations, oppositions = af.getInteractions(event_dataset, actorName)

        pool.addBaseActor(
            actorID,
            actorName,
            actorType,
            eventReportIds,
            eventTypeSummary,
            eventTypes,
            links,
            collaborations,
            oppositions,
        )
    return pool

def get_actors(gw_number):
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    filename = os.path.join(data_dir, ACTORS_DIR, f"computed_actors_{gw_number}.json")
    if os.path.exists(filename):
        return read_actors(filename)
    else:
        return create_actors(gw_number, data_dir)
