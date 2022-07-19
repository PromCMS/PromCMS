import { useEntryUnderpageContext } from '@components/pages/EntryUnderpage';
import UnderPageBreadcrumbsMenu from '@components/UnderPageBreadcrumbsMenu';
import useCurrentModel from '@hooks/useCurrentModel';
import { Skeleton } from '@mantine/core';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import { EntryService } from '@services';
import clsx from 'clsx';
import { HTMLAttributes } from 'react';
import { DetailedHTMLProps } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface EntryEditorLayoutAsideProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  open: boolean;
  onClose: () => void;
}
export interface EntryEditorLayoutContentProps {}
export interface EntryEditorLayoutProps {}

export interface EntryEditorLayoutParts {
  Aside: FC<EntryEditorLayoutAsideProps>;
  Content: FC<EntryEditorLayoutContentProps>;
}

export const EntryEditorLayout: FC<EntryEditorLayoutProps> &
  EntryEditorLayoutParts = ({ children }) => {
  const { onSubmit } = useEntryUnderpageContext();

  return (
    <form autoComplete="off" onSubmit={onSubmit} className="flex">
      {children}
    </form>
  );
};

EntryEditorLayout.Content = function Content({ children }) {
  const model = useCurrentModel();
  const { currentView, itemIsLoading, itemData } = useEntryUnderpageContext();
  const { t } = useTranslation();

  // TODO: Rewrite page layout and use it here
  return (
    <div className="container relative mx-auto mb-10">
      <UnderPageBreadcrumbsMenu
        className="py-5"
        items={[
          { content: t('Entry types') as string },
          {
            isLinkTo: EntryService.getListUrl(model?.name as string),
            content: t(capitalizeFirstLetter(model?.name || '')) as string,
          },
          {
            content: t(currentView == 'update' ? 'Update' : 'Create') as string,
          },
          {
            content:
              itemIsLoading && currentView === 'update' ? (
                <Skeleton className="h-4 w-16 flex-none" />
              ) : (
                <p className="flex-none text-green-500 underline">
                  {currentView == 'update' ? itemData?.id : t('Create')}
                </p>
              ),
          },
        ]}
      />
      <div className="mt-10 items-start justify-between xl:flex">
        <div className="relative w-full">{children}</div>
      </div>
    </div>
  );
};

EntryEditorLayout.Aside = function Aside({ children, className, ...rest }) {
  const { asideOpen } = useEntryUnderpageContext();

  return (
    <aside
      className={clsx(
        'sticky top-0 z-10 transition-[width] duration-300',
        asideOpen ? 'w-[500px]' : 'h-0 w-0 overflow-hidden'
      )}
    >
      <div className={clsx('h-full w-[500px] py-5 pl-8', className)} {...rest}>
        {children}
      </div>
    </aside>
  );
};
