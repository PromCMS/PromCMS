import { FC, PropsWithChildren } from 'react';

export const Content: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="lg:mt-10 items-start justify-between xl:flex">
      <div className="relative w-full flex flex-col-reverse lg:block">
        {children}
      </div>
    </div>
  );
};
