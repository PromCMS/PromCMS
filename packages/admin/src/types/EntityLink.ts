import { ResultItem } from '@prom-cms/api-client';

export type EntityLink<T extends ResultItem> = Pick<T, 'id'> &
  Partial<Omit<T, 'id'>>;
