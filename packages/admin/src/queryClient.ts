import { QueryClient } from '@tanstack/react-query';

// const defaultQueryFn = async ({ queryKey }: QueryFunctionContext<any>) => {
//   return apiClient.entries
//     .getOne(queryKey[0], queryKey[1])
//     .then(({ data }) => data.data);
// };

export const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     queryFn: defaultQueryFn,
  //   },
  // },
});
