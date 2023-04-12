import { Text } from 'ink';
import { FC } from 'react';
import { Spinner } from './Spinner.js';

export const WorkingMessage: FC = () => (
  <Text>
    Working... <Spinner />
  </Text>
);
