import clsx from 'clsx';
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';

export interface PageLayoutProps {
  rightAsideOutlet?: ReactNode;
}

export interface HeaderProps {
  title?: ReactNode;
  beforeOutlet?: ReactNode;
  classNames?: {
    wrapper?: string;
  };
}

export interface SectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
}

export interface ContentProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Header: FC<PropsWithChildren<HeaderProps>> = ({
  children,
  title,
  beforeOutlet,
  classNames,
}) => {
  return (
    <header className="max-w-[1760px] mx-auto">
      <div className={classNames?.wrapper}>
        {beforeOutlet}
        {title ? (
          <h1 className="text-4xl font-semibold mt-6">{title}</h1>
        ) : null}
        {children}
      </div>
      <hr className="mt-7 h-0.5 w-full border-0 bg-project-border" />
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
    <section className={clsx(className)} {...rest}>
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

const Content: FC<PropsWithChildren<ContentProps>> = ({
  children,
  className,
  title,
  ...rest
}) => {
  return (
    <section className={clsx('container mx-auto', className)} {...rest}>
      {children}
    </section>
  );
};

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> & {
  Header: typeof Header;
  Section: typeof Section;
  Content: typeof Content;
} = ({ children, rightAsideOutlet }) => {
  return (
    <div className="flex min-h-screen">
      <div
        className={clsx(
          'bg-white shadow-md rounded-t-xl sm:rounded-none w-full sm:rounded-tr-prom px-5'
        )}
      >
        {children}
      </div>
      {rightAsideOutlet ? (
        <aside className="flex-none ml-2 mr-2">{rightAsideOutlet}</aside>
      ) : null}
    </div>
  );
};

PageLayout.Header = Header;
PageLayout.Section = Section;
PageLayout.Content = Content;
