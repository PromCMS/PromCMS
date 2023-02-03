import { FC, PropsWithChildren } from 'react';
import { Divider as MantineDivider } from '@mantine/core';

export type HeaderComponent = FC<PropsWithChildren> & {
  Divider: FC;
  Title: FC<PropsWithChildren>;
};

const Header: HeaderComponent = ({ children }) => (
  <header className="mr-9 w-full pb-5 xl:mr-0">{children}</header>
);

const Divider = () => <MantineDivider size={'sm'} mt="lg" />;

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="mt-0 text-5xl font-bold">{children}</h1>
);

Header.Divider = Divider;
Header.Title = Title;

export { Header };
