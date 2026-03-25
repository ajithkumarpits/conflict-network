import axiosInstance from "../services/api";
import {ENDPOINTS} from '../constants/apiEndpoints'
import { queryClient } from '../queryClient';


export const getCurrentEventDataYear = async () => {
 /**
     * Reqest the current year for which event data is displayed.
     * Parameters: None
     */
    return queryClient.fetchQuery({
        queryKey: ['eventsYear'],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.GET_EVENTS_YEAR);
            return response.data;
        }
    });
};

export const getEventsFatalities = async () => {
   /**
     * Reqest data used for the initial conflict data map colouring.
     * Parameters: None
     */

    return queryClient.fetchQuery({
        queryKey: ['eventsFatalities'],
        queryFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.GET_EVENTS_FATALITIES);
            return response.data;
        }
    });
};


const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadFile = async (params) => {
  /**
   * Download a file from the server using Axios.
   * Parameters: filename(str) -> name of the file which should be downloaded
   */
  try {
    const urlParams = new URLSearchParams (params);
    const filename = urlParams.get("filename") || "downloaded-file"; 
    const response = await axiosInstance.get(ENDPOINTS.DOWNLOAD_FILE, {
      params: urlParams,
      responseType: "blob",
    });
    downloadBlob(new Blob([response]), filename);
  } catch (error) {
  }
};

export const downloadMultipleFiles = async (params) => {
  /**
   * Download multiple files as zip from the server.
   * Parameters: filenames(list(str)) -> name of all files which should be downloaded
   */
  const filename = "dyad_backgrounds.zip";

  try {
       const queryParams = new URLSearchParams(params);
       const response = await axiosInstance.get(ENDPOINTS.DOWNLOAD_MULTIPLE_FILE, {
         params: queryParams,
         responseType: "blob",
       });
  
    downloadBlob(new Blob([response]), filename);
  } catch (error) {
    // Handle error here
  }
};