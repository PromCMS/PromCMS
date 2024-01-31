import clsx from 'clsx';
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { ReactChildren } from '@custom-types';

export interface PageLayoutProps {
  withAside?: boolean;
  leftAside?: ReactChildren[] | ReactChildren;
}

export interface HeaderProps {
  title?: string;
}

export interface SectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <header className="mt-6">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <hr className="mt-4 border-t-4 border-gray-200" />
    </header>
  );
};

const Section: FC<PropsWithChildren<SectionProps>> = ({
  children,
  className,
  title,
  ...rest
}) => {
  return (
    <section
      className={clsx(
        'rounded-xl border-2 border-project-border bg-white px-5 shadow-lg shadow-blue-100',
        className
      )}
      {...rest}
    >
      {title && (
        <>
          <h1 className="pt-5 pb-4 text-3xl">{title}</h1>
          <hr className="border-2 border-blue-100" />
        </>
      )}
      {children}
    </section>
  );
};

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> & {
  Header: typeof Header;
  Section: typeof Section;
} = ({ children, withAside, ...rest }) => {
  return withAside ? (
    <PageLayoutWithAside {...rest}>{children}</PageLayoutWithAside>
  ) : (
    <div className="container mx-auto mb-10">{children}</div>
  );
};

const useClassNames = () => ({
  aside: clsx('w-full flex-none lg:max-w-xs'),
});

const PageLayoutWithAside: FC<PropsWithChildren<PageLayoutProps>> = ({
  children,
  leftAside,
}) => {
  const classNames = useClassNames();

  return (
    <div className="flex flex-col justify-center lg:min-h-screen lg:flex-row">
      <div className={classNames.aside}>{leftAside}</div>
      <div className="container w-full">{children}</div>
      <div className={clsx(classNames.aside, 'hidden 2xl:block')} />
    </div>
  );
};

PageLayout.Header = Header;
PageLayout.Section = Section;
