import { FC, PropsWithChildren } from 'react';

export const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container relative mx-auto mb-5 lg:mb-10">{children}</div>
  );
};
