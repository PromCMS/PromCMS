import { Paper, Title } from '@mantine/core';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

const AsideItemWrap: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    description?: string;
  }
> = ({ children, className, title, ref, description, ...rest }) => (
  <Paper className={clsx('rounded-prom', className)} withBorder {...rest}>
    {title && (
      <Title order={5} className="w-full px-4 mt-4 my-3 text-xl font-semibold">
        {title}
      </Title>
    )}
    {description && (
      <p className="-mt-2 mb-4 px-4 font-medium text-gray-500">{description}</p>
    )}
    <hr className="border-b-2 border-project-border mx-4" />
    {children}
  </Paper>
);

export default AsideItemWrap;
