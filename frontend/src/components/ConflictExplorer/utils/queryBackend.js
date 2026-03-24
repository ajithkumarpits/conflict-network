
import axiosInstance from "../../../services/api";
import {ENDPOINTS} from '../../../constants/apiEndpoints'
import { queryClient } from '../../../queryClient';


export const getDataByPeriod = async (params) => {
  /**
   * Reqest data set with events lying inside the specified period.
   * - params = [start, end, gw_number]
   */

    return queryClient.fetchQuery({
        queryKey: ['dataByPeriod', params],
        queryFn: async () => {
            const response = await axiosInstance.get( ENDPOINTS.GET_DATA_BY_PERIOD ,{params});
            return response.data;
        }
    });
};



export const getGraphData = async (params) => {
  /**
   * Reqest the graph data for the specified time period.
   * -params = [start, end, gw_number]
   * -returns: {'nodes': list, 'links': list}
   */

    return queryClient.fetchQuery({
        queryKey: ['graphData', params],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.GET_EVENT_GRAPH ,{params});
            return response.data
        }
    });
};


export const getFilteredByActorNames = async (params) => {
  /**
   * Reqest the data set filtered based on ids, period, event types and/or actor names.
   * -params = [ids, start, end, eventTypes, actorNames, gw_number]
   * -returns: {}
   */
  return queryClient.fetchQuery({
      queryKey: ['filteredByActorNames', params],
      queryFn: async () => {
          const response = await axiosInstance.get(
              `${ENDPOINTS.GET_FILTERED_BY_ACTOR_NAMES}${params}`
          );
          return response.data;
      }
  });
};


export const getReportsByFilters = async (params) => { 
  /**
   * Reqest the data set filtered based on ids, period, event types and/or actor names.
   * -params = [ids, start, end, eventTypes, actorNames, gw_number]
   * -returns: {}
   */

    return queryClient.fetchQuery({
        queryKey: ['reportsByFilters', params],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `${ENDPOINTS.GET_REPORTS_BY_FILTERS}${params}`
            );
            return response.data;
        }
    });
};



export const getFullActors = async (params) => {
   /**
     * Request all actors for the selected country sorted by descending number of events.
     * -params = [gw_number]
     * -returns: [{
     * id: int, 
     * dataBasedName: str,
     * actorType: int,
     * collaborations: {str: number},
     * oppositions: {str: number},
     * eventTypes: list(int),
     * eventTypeSummary: {int: float},
     * eventReportIds: list(int),
     * }]
     */

    return queryClient.fetchQuery({
        queryKey: ['fullActors', params],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.GET_FULL_ACTORS ,{params}
            );
            return response.data;
        }
    });
};



export const getEventTypeColours = async () => {
 /**
     * Reqest the event type colour assignment.
     * -params = None
     * -returns: dict
     */

    return queryClient.fetchQuery({
        queryKey: ['eventTypeColours'],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.GET_EVENT_TYPE_COLOURS);
            return response.data;
        }
    });
};



export const updateEventTypeColours = async (newColours) => {
  /**
   * Update event type colour assignment.
   * -params = newColours: dict[str, str]
   * -returns: (dict(str, str))
   */

    const response = await axiosInstance.put( ENDPOINTS.SET_EVENT_TYPE_COLOURS , newColours);
    return response.data;
};

export const getLinkTypeColours = async () => {
  /**
     * Request link type colour assignment.
     * -params = None
     * -returns: (dict(str, str)) 
     */

    return queryClient.fetchQuery({
        queryKey: ['linkTypeColours'],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.GET_LINK_TYPE_COLOURS);
            return response.data;
        }
    });
};



export const updateLinkTypeColours = async (newColours) => {
   /**
     * Update link type colour assignment.
     * -params = newColours: dict[str, str]
     * -returns: (dict(str, str)) 
     */

    const response = await axiosInstance.put(ENDPOINTS.SET_LINK_TYPE_COLOURS, newColours);
    return response.data;
};


export const getPeriodInfo = async (params) => {//// 500 res
  /**
     * Request an actors activity grouped by months.
     * -params = [gw_number]
     * -returns: Object
     */

  return queryClient.fetchQuery({
      queryKey: ['periodInfo', params],
      queryFn: async () => {
          const response = await axiosInstance.get(`/get-period-info${params}`);
          return response.data;
      }
  });
};


export const getActorTimeline = async (params) => {
   /**
     * Request an actors activity grouped by months.
     * -params = [gw_number]
     * -returns: Object
     */

   return queryClient.fetchQuery({
       queryKey: ['actorTimeline', params],
       queryFn: async () => {
           const response = await axiosInstance.get(ENDPOINTS.GET_ACTOR_TIMELINE,{params});
           return response.data;
       }
   });
};



export const getCentroidByGW = async (params) => {
  /**
   * Request a countries centroid coordinates.
   * -params = [gw_number]
   * -returns: Object
   */

    return queryClient.fetchQuery({
        queryKey: ['centroidByGW', params],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.GET_CENTROID_LOCATION,{
                params
            });
            return response.data;
        }
    });
};


export const getMapOverlay = async (params) => {
  /**
   * Request the world shape minus the selected country.
   * -params = [gw_number]
   * -returns: geojson
   */

    return queryClient.fetchQuery({
        queryKey: ['mapOverlay', params],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.GET_MAP_OVERLAY,{params});
            return response.data;
        }
    });
};


