import { QueryParams } from '../types';

export const formatQueryParams = ({ where, ...restParams }: QueryParams) => {
  const params: Record<string, string | number> = { ...restParams };

  if (where) {
    params['where'] = Object.entries(where || {})
      .map(([key, { manipulator, value }]) => `${key}.${manipulator}.${value}`)
      .join(';');
  }

  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
};
