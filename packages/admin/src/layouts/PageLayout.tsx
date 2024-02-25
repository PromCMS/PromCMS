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
  rightAsideClassName?: string;
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
    <header className="container mx-auto">
      <div className={classNames?.wrapper}>
        {beforeOutlet}
        {title ? (
          <h1 className="text-2xl sm:text-4xl font-semibold mt-6">{title}</h1>
        ) : null}
        {children}
      </div>
      <hr className="mb-5 mt-0 h-0.5 w-full border-0 bg-project-border" />
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
} = ({ children, rightAsideOutlet, rightAsideClassName }) => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row min-h-screen bg-white sm:bg-transparent dark:bg-gray-800 sm:dark:bg-transparent dark:bg-opacity-60 sm:dark:bg-opacity-100 rounded-t-xl h-full">
      <div
        className={clsx(
          'sm:bg-white sm:dark:bg-gray-800 sm:dark:bg-opacity-60 w-full rounded-bl-prom lg:rounded-bl-none sm:backdrop-blur-sm lg:rounded-tr-prom py-4 min-h-screen'
        )}
      >
        {children}
      </div>
      {rightAsideOutlet ? (
        <aside
          className={clsx(
            'flex-none lg:ml-2 sm:mr-2 p-3 sm:p-0',
            rightAsideClassName
          )}
        >
          {rightAsideOutlet}
        </aside>
      ) : null}
    </div>
  );
};

PageLayout.Header = Header;
PageLayout.Section = Section;
PageLayout.Content = Content;
