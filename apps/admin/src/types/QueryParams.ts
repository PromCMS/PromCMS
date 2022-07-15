import { WhereQueryParam } from './WhereQueryParam';

export type QueryParams =
  | {
      page?: number;
      where?: WhereQueryParam;
    }
  | Record<string, string | number>;
