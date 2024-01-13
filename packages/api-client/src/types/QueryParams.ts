import { WhereQueryParameter } from './WhereQueryParameter';

export type QueryParams =
  | {
      page?: number;
      where?: WhereQueryParameter;
      limit?: number;
    }
  | Record<string, string | number>;
