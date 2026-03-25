import axios from "axios";
import { toast } from "react-toastify"; 

const api = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status >= 500 && status < 600) {
      window.location.href = "/error";
    }
    if (status >= 400 && status < 500) {
      toast.error("Something went wrong", {
        toastId: "api-error"
      });
    }

    return Promise.reject(error);
  }
);

export default api;
