import UnderPageBreadcrumbsMenu from '@components/UnderPageBreadcrumbsMenu';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Breadcrumbs: FC = () => {
  const { t } = useTranslation();
  const singleton = useCurrentSingleton(true);

  return (
    <>
      <UnderPageBreadcrumbsMenu
        className="py-5"
        items={[
          { content: t('Singletons') as string },
          {
            content: (
              <p className="flex-none text-green-500 underline">
                {singleton.title || singleton.name}
              </p>
            ),
          },
        ]}
      />
    </>
  );
};
