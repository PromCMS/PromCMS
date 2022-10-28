import axios from 'axios';
import { userHasBeenLoggedOff } from '@events';
import { ApiClient } from '@prom-cms/api-client';

export const apiClient = new ApiClient({
  baseURL: new URL('/api', window.location.origin).toString(),
  timeout: 15000,
});

apiClient.getAxios().interceptors.response.use(undefined, (error) => {
  if (
    window &&
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    error.response?.data?.code === 'not-logged-in'
  ) {
    window.dispatchEvent(userHasBeenLoggedOff);
  }

  return Promise.reject(error);
});
