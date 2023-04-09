import { FC } from 'react';
import { Spinner } from './Spinner.js';

export const WorkingMessage: FC = () => (
  <>
    Working... <Spinner />
  </>
);
