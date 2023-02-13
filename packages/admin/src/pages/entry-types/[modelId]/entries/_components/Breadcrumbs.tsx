import UnderPageBreadcrumbsMenu from '@components/UnderPageBreadcrumbsMenu';
import { pageUrls } from '@constants';
import useCurrentModel from '@hooks/useCurrentModel';
import { Skeleton } from '@mantine/core';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryUnderpageContext } from '../_context';

export const Breadcrumbs: FC = () => {
  const { t } = useTranslation();
  const { currentView, itemIsLoading, itemData } = useEntryUnderpageContext();
  const model = useCurrentModel();

  return (
    <UnderPageBreadcrumbsMenu
      className="py-5"
      items={[
        { content: t('Entry types') as string },
        {
          isLinkTo: pageUrls.entryTypes(model?.name as string).list,
          content: t(
            capitalizeFirstLetter(model?.title || model?.name || '')
          ) as string,
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
  );
};
