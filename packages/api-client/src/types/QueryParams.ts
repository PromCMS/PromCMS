import { WhereQueryParameter } from './WhereQueryParameter';

export type QueryParams =
  | {
      page?: number;
      where?: WhereQueryParameter;
      limit?: number;
      unstable_fetchReferences?: true;
    }
  | Record<string, string | number>;
