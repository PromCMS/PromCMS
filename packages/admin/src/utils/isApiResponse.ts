import { AxiosResponse } from 'axios';
import { Response, ResultItem } from '@prom-cms/api-client';

export const isApiResponse = <
  ResponseData = ResultItem,
  ResponseCode = number | string,
>(
  response: AxiosResponse | undefined
): response is AxiosResponse<Response<ResponseData, ResponseCode>> =>
  !!response &&
  'code' in response.data &&
  'message' in response.data &&
  'data' in response.data;
