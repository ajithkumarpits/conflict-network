import logging
import pandas as pd
import json
import os

from .redis import RedisClient
from .actor_functions import LINK_TYPES, find_existing, find_node_id
from api.peace_processes import get_full_peace_data, get_filtered_gw
from config.specifications import (
    FULL_PEACE_DATA,
    PP_SIDE_A_COL,
    PP_SIDE_B_COL,
    PP_THIRD_PARTY_COL,
    PP_MEDIATED_COL,
    PP_NEGOTIATION_ID_COL,
    MULTIPLE_SEPARATOR,
)

logger = logging.getLogger("conflict_network")
redis_client = RedisClient()

# Curvature applied to mediation edges so they don't overlap with cooperation/opposition edges
MEDIATION_CURVATURE = 0.3


def _parse_third_parties(third_party_value):
    if pd.isna(third_party_value) or third_party_value == 0 or third_party_value == "0":
        return []
    tp_str = str(third_party_value).strip()
    if not tp_str:
        return []
    return [name.strip() for name in tp_str.split(";") if name.strip()]


def _get_or_create_node(nodes, actor_name, next_id_counter, node_type="third_party", actors=None):
    for node in nodes:
        if node["actor_name"] == actor_name:
            return node["actor_id"], False

    new_id = None
    if actors is not None:
        for actor in actors.actors:
            if actor.originalName == actor_name:
                new_id = actor.id
                break
                
    if new_id is None:
        new_id = next_id_counter

    new_node = {
        "actor_id": new_id,
        "actor_name": actor_name,
    }
    if node_type:
        new_node["node_type"] = node_type
        
    nodes.append(new_node)
    return new_id, True


def get_mediation_links_and_nodes(gw_number, existing_nodes, existing_links, start_date=None, end_date=None, actors=None):
    try:
        # Load peace data (try Redis cache first)
        cache_key = FULL_PEACE_DATA
        cached_data = redis_client.get_value(cache_key)
        if cached_data.get("value") is not None:
            data = json.loads(cached_data.get("value"))
            peace_data = pd.read_json(data, orient="records")
        else:
            peace_data = get_full_peace_data()

        if peace_data is None or peace_data.empty:
            return [], []

        # Filter by country
        peace_data_gw = get_filtered_gw(gw_number, peace_data)
        if peace_data_gw is None or peace_data_gw.empty:
            return [], []

        # Filter by date if provided
        if start_date and end_date:
            try:
                query_start = pd.to_datetime(start_date)
                query_end = pd.to_datetime(end_date)
                
                def is_in_period(row):
                    s_yr = row.get('start_negotiations_year')
                    s_mo = row.get('start_negotiations_month')
                    s_da = row.get('start_negotiations_day')
                    e_yr = row.get('end_negotiations_year')
                    e_mo = row.get('end_negotiations_month')
                    e_da = row.get('end_negotiations_day')

                    if pd.isna(s_yr) or s_yr == 0:
                        return False
                    
                    s_mo = s_mo if pd.notna(s_mo) and s_mo != 0 else 1
                    s_da = s_da if pd.notna(s_da) and s_da != 0 else 1
                    try:
                        s_date = pd.Timestamp(year=int(s_yr), month=int(s_mo), day=int(s_da))
                    except ValueError:
                        s_date = pd.Timestamp(year=int(s_yr), month=1, day=1)

                    if pd.isna(e_yr) or e_yr == 0:
                        e_date = s_date
                    else:
                        e_mo = e_mo if pd.notna(e_mo) and e_mo != 0 else 12
                        e_da = e_da if pd.notna(e_da) and e_da != 0 else 28
                        try:
                            e_date = pd.Timestamp(year=int(e_yr), month=int(e_mo), day=int(e_da))
                        except ValueError:
                            e_date = pd.Timestamp(year=int(e_yr), month=12, day=28)

                    # Overlap: negotiation start <= query end AND negotiation end >= query start
                    return s_date <= query_end and e_date >= query_start

                # Use current module's pandas reference
                peace_data_gw = peace_data_gw[peace_data_gw.apply(is_in_period, axis=1)]
                if peace_data_gw.empty:
                    return [], []
            except Exception as e:
                logger.error(f"Error filtering dates for mediation data: {e}")

        all_nodes = list(existing_nodes)
        new_nodes = []
        mediation_links = []

        if all_nodes:
            next_id = max(node["actor_id"] for node in all_nodes) + 1
        else:
            next_id = 1

        link_type = LINK_TYPES['MED']

        for _, row in peace_data_gw.iterrows():
            third_parties = _parse_third_parties(row.get(PP_THIRD_PARTY_COL, 0))
            if not third_parties:
                continue

            side_a = str(row.get(PP_SIDE_A_COL, "")).strip()
            side_b = str(row.get(PP_SIDE_B_COL, "")).strip()
            negotiation_id = row.get(PP_NEGOTIATION_ID_COL, 0)

            side_a_actors = [a.strip() for a in side_a.split(MULTIPLE_SEPARATOR) if a.strip()] if side_a else []
            side_b_actors = [b.strip() for b in side_b.split(MULTIPLE_SEPARATOR) if b.strip()] if side_b else []

            for mediator in third_parties:
                mediator_id, is_new = _get_or_create_node(all_nodes, mediator, next_id, actors=actors)
                if is_new:
                    new_nodes.append(all_nodes[-1])
                    next_id += 1

                for actor_name in side_a_actors:
                    actor_id = find_node_id(all_nodes, actor_name)
                    if actor_id == -1:
                        actor_id, was_new = _get_or_create_node(all_nodes, actor_name, next_id, node_type=None, actors=actors)
                        if was_new:
                            new_nodes.append(all_nodes[-1])
                            next_id += 1

                    index = find_existing(mediation_links, mediator_id, actor_id, link_type)
                    if index != -1:
                        if negotiation_id is not None and negotiation_id != 0 and negotiation_id not in mediation_links[index]['reports']:
                            mediation_links[index]['reports'].append(negotiation_id)
                            mediation_links[index]['count'] += 1
                    else:
                        reports = [negotiation_id] if negotiation_id is not None and negotiation_id != 0 else []
                        mediation_links.append({
                            'source': mediator_id,
                            'target': actor_id,
                            'linkType': link_type,
                            'count': len(reports),
                            'reports': reports,
                            'curvature': MEDIATION_CURVATURE,
                        })

                for actor_name in side_b_actors:
                    actor_id = find_node_id(all_nodes, actor_name)
                    if actor_id == -1:
                        actor_id, was_new = _get_or_create_node(all_nodes, actor_name, next_id, node_type=None, actors=actors)
                        if was_new:
                            new_nodes.append(all_nodes[-1])
                            next_id += 1

                    index = find_existing(mediation_links, mediator_id, actor_id, link_type)
                    if index != -1:
                        if negotiation_id is not None and negotiation_id != 0 and negotiation_id not in mediation_links[index]['reports']:
                            mediation_links[index]['reports'].append(negotiation_id)
                            mediation_links[index]['count'] += 1
                    else:
                        reports = [negotiation_id] if negotiation_id is not None and negotiation_id != 0 else []
                        mediation_links.append({
                            'source': mediator_id,
                            'target': actor_id,
                            'linkType': link_type,
                            'count': len(reports),
                            'reports': reports,
                            'curvature': MEDIATION_CURVATURE,
                        })

        logger.info(f"Created {len(mediation_links)} mediation/artificial links and {len(new_nodes)} new nodes for gw_number={gw_number}")
        return new_nodes, mediation_links

    except Exception as e:
        logger.error(f"Error extracting mediation data: {e}")
        return [], []
