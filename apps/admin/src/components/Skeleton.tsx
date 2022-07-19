import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

export interface SkeltonProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Skeleton: FC<SkeltonProps> = ({ className }) => (
  <div className={clsx('animate-pulse rounded-xl bg-gray-300', className)} />
);

export default Skeleton;
