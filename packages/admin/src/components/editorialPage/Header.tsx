import { Divider as MantineDivider } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';

export type HeaderComponent = FC<PropsWithChildren> & {
  Divider: FC;
  Title: FC<PropsWithChildren>;
};

const Header: HeaderComponent = ({ children }) => (
  <header className="mr-9 w-full pb-5 xl:mr-0">{children}</header>
);

const Divider = () => <MantineDivider size={'sm'} className="sm:mt-5 mt-2" />;

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="mt-0 text-xl sm:text-3xl font-bold mb-0">{children}</h1>
);

Header.Divider = Divider;
Header.Title = Title;

export { Header };
