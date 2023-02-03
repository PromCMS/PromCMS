import { FC, PropsWithChildren } from 'react';

export const Content: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mt-10 items-start justify-between xl:flex">
      <div className="relative w-full">{children}</div>
    </div>
  );
};
