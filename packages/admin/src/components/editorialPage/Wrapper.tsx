import { FC, PropsWithChildren } from 'react';

export const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="container relative mx-auto mb-10">{children}</div>;
};
