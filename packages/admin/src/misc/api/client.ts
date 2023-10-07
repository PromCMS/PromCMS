import axios, { AxiosError } from 'axios';
import { userHasBeenLoggedOff } from '@events';
import { ApiClient } from '@prom-cms/api-client';

export const apiClient = new ApiClient({
  baseURL: new URL('/api', window.location.origin).toString(),
  timeout: 15000,
});

const isNotLoggedInError = (
  payload: any
): payload is AxiosError<{ code: string }, any> =>
  axios.isAxiosError(payload) &&
  payload.response?.status === 401 &&
  (payload.response?.data as { code: string })?.code === 'not-logged-in';

apiClient.getAxios().interceptors.response.use(undefined, (error) => {
  if (window && isNotLoggedInError(error)) {
    window.dispatchEvent(userHasBeenLoggedOff);
  }

  return Promise.reject(error);
});
