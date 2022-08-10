import { FC, ReactElement } from 'react';

export interface Page<T = {}> extends FC<T> {
  getLayout?: (page?: Page) => ReactElement<any, any> | null;
}
