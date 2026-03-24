import { useState, useEffect, useMemo } from 'react';
import { trackPromise } from 'react-promise-tracker';
import axiosInstance from '../services/api';
import { queryClient } from '../queryClient';


const useGet = (endpoint, params = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  useEffect(() => {
    if (!endpoint) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await queryClient.fetchQuery({
            queryKey: [endpoint, memoizedParams],
            queryFn: async () => {
                const response = await trackPromise(axiosInstance.get(endpoint, { params: memoizedParams }));
                return response.data;
            }
        });
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [endpoint, memoizedParams]);

  return { data, loading, error };
};

export default useGet;

