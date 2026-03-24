import logging
import pandas as pd
import itertools
import random
from config.specifications import (
    DATA_SIDE_A_COL, 
    DATA_SIDE_B_COL, 
    MULTIPLE_SEPARATOR,
    DATA_EVENT_TYPE_COL, 
    DATA_ID_COL,
    ACTOR_ID, 
    ACTOR_NAME, 
    ACTOR_ORG
)

LINK_TYPES = {'COOP': 0, 'OPP': 1, 'MED': 2}
logger = logging.getLogger("conflict_network")

def getRelevantDF(df, actorName):
    df_copy = df.copy() 
    if df_copy.empty:
        df_copy['found'] = False
        return df_copy.loc[df_copy['found'] == True]
    df_copy['found'] = (
        df_copy[DATA_SIDE_A_COL].apply(lambda x: actorName in set(x.split(MULTIPLE_SEPARATOR))) | 
        df_copy[DATA_SIDE_B_COL].apply(lambda x: actorName in set(x.split(MULTIPLE_SEPARATOR)))
    )
    relevant_full = df_copy.loc[df_copy['found'] == True]
    return relevant_full

def getRelevantCombined(df, names):
    df_copy = df.copy() 
    if df_copy.empty:
        df_copy['found'] = False
        return df_copy.loc[df_copy['found'] == True]
    df_copy['found'] = (
        df_copy[DATA_SIDE_A_COL].apply(lambda x: len([n for n in names if n in set(x.split(MULTIPLE_SEPARATOR))]) > 0) | 
        df_copy[DATA_SIDE_B_COL].apply(lambda x: len([n for n in names if n in set(x.split(MULTIPLE_SEPARATOR))]) > 0)
    )
    relevant_full = df_copy.loc[df_copy['found'] == True]
    return relevant_full

def getIdsLink(df, names):
    if df.empty:
        return []
    df_copy = df.copy() 
    df_copy['found'] = (
        (
            df_copy[DATA_SIDE_A_COL].apply(lambda x: len([n for n in names if n in set(x.split(MULTIPLE_SEPARATOR))]) > 0) &
            df_copy[DATA_SIDE_B_COL].apply(lambda x: len([n for n in names if n in set(x.split(MULTIPLE_SEPARATOR))]) > 0)
        ) |
        (df_copy[DATA_SIDE_A_COL].apply(lambda x: len([n for n in names if n in set(x.split(MULTIPLE_SEPARATOR))]) > 1)) |
        (df_copy[DATA_SIDE_B_COL].apply(lambda x: len([n for n in names if n in set(x.split(MULTIPLE_SEPARATOR))]) > 1))
    )
    relevant_full = df_copy.loc[df_copy['found'] == True]
    return list(relevant_full[DATA_ID_COL])

def getEventTypeSummary(df, name):
    relevant_full = getRelevantDF(df, name)
    overall_entries = relevant_full.shape[0]
    if overall_entries == 0:
        return [], {}
    relevant_full['count'] = 1
    uniqueEvents = relevant_full[DATA_EVENT_TYPE_COL].unique().tolist()
    event_counts_full = relevant_full.groupby([DATA_EVENT_TYPE_COL])['count'].count()
    event_counts_full = event_counts_full / overall_entries
    all_events = list(df[DATA_EVENT_TYPE_COL].unique())
    for event in all_events:
        if event not in event_counts_full:
            event_counts_full[event] = 0
    result = uniqueEvents, event_counts_full.sort_index().to_dict()
    return result

def getEventReportIds(df, name):
    relevant_df = getRelevantDF(df, name)
    allIds = list(relevant_df[DATA_ID_COL])
    return allIds

def getActorId(actor_df, name):
    relevantDF = actor_df.loc[actor_df[ACTOR_NAME] == name]
    relIds = list(relevantDF[ACTOR_ID].unique())
    if len(relIds) == 0:
        idx = random.randrange(100, 1000)
        actorId = str(len(name)) + str(idx) + str(len(name))
    else:
        actorId = relIds[0]
    return int(actorId)

def getActorType(df, actors, name):
    relevantDF = getRelevantDF(df, name)
    if relevantDF.empty:
        return 5
    reducedDF = relevantDF[[DATA_SIDE_A_COL, DATA_ID_COL if DATA_ID_COL in relevantDF.columns else DATA_SIDE_A_COL, DATA_SIDE_B_COL]] # Simplified logic for extraction
    # Simplified version for open source
    nameDF = actors.loc[actors[ACTOR_NAME] == name]
    types = nameDF[ACTOR_ORG].unique()
    if len(types) == 0:
        resType = 5
    else:
        resType = int(types[0])
    return resType

def get_all_actors_list(df, sideA, sideB):
    all_actors = df[[sideA, sideB]].values.tolist()
    all_actors = [item for sublist in all_actors for item in sublist]
    all_actors = [str(actor).split(MULTIPLE_SEPARATOR) for actor in all_actors]
    all_actors = [item for sublist in all_actors for item in sublist if item != "-"]
    all_actors = list(set(all_actors))
    return all_actors 

def find_existing(links, node_id_a, node_id_b, linkType):
    index = [idx for (idx, elem) in enumerate(links) if (
        (
            ((elem['source'] == node_id_a) & (elem['target'] == node_id_b))
            | ((elem['target'] == node_id_a) & (elem['source'] == node_id_b))
        ) 
        & (elem['linkType'] == linkType)
    )]
    if len(index) >= 1:
        return (index[0])
    else:
        return -1 
    
def get_collabs_oppositions(relevant_df, name):
    collaborations = {}
    oppositions = {}
    actors_a = relevant_df[['side_a']].copy()
    actors_b = relevant_df[['side_b']].copy()
    actors_a['count'] = 1
    actors_b['count'] = 1
    side_a = actors_a.groupby('side_a').count()
    side_b = actors_b.groupby('side_b').count()
    a_dict = side_a.to_dict(orient='dict')['count']
    b_dict = side_b.to_dict(orient='dict')['count']
    for side_name in a_dict.keys():
        names = side_name.split(MULTIPLE_SEPARATOR)
        if (len(names) > 1):
            if(name in names):
                for collab in names:
                    if (collab != name):
                        collaborations[collab] = a_dict[side_name] + (collaborations[collab] if (collab in collaborations.keys()) else 0)
            else:
                for oppo in names:
                    oppositions[oppo] = a_dict[side_name] + (oppositions[oppo] if (oppo in oppositions.keys()) else 0)
        else:
            oppo = names[0]
            if (oppo != name):
                oppositions[oppo] = a_dict[side_name] + (oppositions[oppo] if (oppo in oppositions.keys()) else 0)
    for side_name in b_dict.keys():
        names = side_name.split(MULTIPLE_SEPARATOR)
        if (len(names) > 1):
            if(name in names):
                for collab in names:
                    if (collab != name):
                        collaborations[collab] = b_dict[side_name] + (collaborations[collab] if (collab in collaborations.keys()) else 0)
            else:
                for oppo in names:
                    oppositions[oppo] = b_dict[side_name] + (oppositions[oppo] if (oppo in oppositions.keys()) else 0)
        else:
            oppo = names[0]
            if (oppo != name):
                oppositions[oppo] = b_dict[side_name] + (oppositions[oppo] if (oppo in oppositions.keys()) else 0)
    return collaborations, oppositions

def find_node_id(nodes, name):
    id = [node['actor_id'] for node in nodes if node['actor_name'] == name]
    if len(id) > 0:
        return id[0]
    else:
        return -1

def getLinksList(small_df, nodes=None):
    links = []
    relevant_subdf = small_df[[DATA_SIDE_A_COL, DATA_SIDE_B_COL, DATA_ID_COL]].copy()
    relevant_subdf[DATA_ID_COL] = relevant_subdf[DATA_ID_COL].astype(str)
    side = relevant_subdf.groupby([DATA_SIDE_A_COL, DATA_SIDE_B_COL])[DATA_ID_COL].apply(MULTIPLE_SEPARATOR.join).reset_index()
    as_list = side.to_dict(orient='records')
    for constellation in as_list:
        side_a = constellation[DATA_SIDE_A_COL].split(MULTIPLE_SEPARATOR)
        side_b = constellation[DATA_SIDE_B_COL].split(MULTIPLE_SEPARATOR)
        reportIDs = [int(float(x)) for x in constellation[DATA_ID_COL].split(MULTIPLE_SEPARATOR)]

        oppositions = list(itertools.product(side_a, side_b))
        collaborations = list(itertools.combinations(side_a, 2)) + list(itertools.combinations(side_b, 2))

        for collab in collaborations:
            actor_i, actor_j = collab
            source_id = find_node_id(nodes, actor_i) if nodes else actor_i
            target_id = find_node_id(nodes, actor_j) if nodes else actor_j
            linkType = LINK_TYPES['COOP']
            index = find_existing(links, source_id, target_id, linkType)
            if index != -1:
                for report_id in reportIDs:
                    if report_id not in links[index]['reports']:
                        links[index]['reports'].append(report_id)
                        links[index]['count'] = links[index]['count'] + 1
            else:
                links.append({'source': source_id, 'target': target_id, 'linkType': linkType, 'count': len(reportIDs), 'reports': reportIDs})
            
        for oppo in oppositions:
            actor_a, actor_b = oppo
            source_id = find_node_id(nodes, actor_a) if nodes else actor_a
            target_id = find_node_id(nodes, actor_b) if nodes else actor_b
            linkType = LINK_TYPES['OPP']
            index = find_existing(links, source_id, target_id, linkType)
            if index != -1:
                for report_id in reportIDs:
                    if report_id not in links[index]['reports']:
                        links[index]['reports'].append(report_id)
                        links[index]['count'] = links[index]['count'] + 1
            else:
                links.append({'source': source_id, 'target': target_id, 'linkType': linkType, 'count': len(reportIDs), 'reports': reportIDs})
    return links

def getInteractions(df, name):
    relevant_df = getRelevantDF(df, name)
    links = getLinksList(relevant_df)
    collabs, oppos = get_collabs_oppositions(relevant_df, name)
    return links, collabs, oppos
