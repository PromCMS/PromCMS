import { Paper, Title } from '@mantine/core';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

const AsideItemWrap: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    description?: string;
  }
> = ({ children, className, title, ref, description, ...rest }) => (
  <Paper
    className={clsx(
      'rounded-lg border-2 border-project-border shadow-lg shadow-blue-100',
      className
    )}
    shadow="smallBlue"
    withBorder
    {...rest}
  >
    {title && (
      <Title order={5} className="w-full px-4 py-4 text-2xl font-semibold">
        {title}
      </Title>
    )}
    {description && (
      <p className="-mt-2 mb-4 px-4 font-medium text-gray-500">{description}</p>
    )}
    <hr className="border-b-2 border-project-border" />
    {children}
  </Paper>
);

export default AsideItemWrap;
