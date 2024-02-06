import { FileList } from '@components/FileList';
import { BASE_PROM_ENTITY_TABLE_NAMES } from '@constants';
import { Page } from '@custom-types';
import { PageLayout, UnderpageLayout } from '@layouts';
import { useModelInfo } from 'hooks/useModelInfo';
import { useRouterQuery } from 'hooks/useRouterQuery';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import NotFoundPage from '../404';

const FilesPage: Page = () => {
  const { t } = useTranslation();
  const model = useModelInfo(BASE_PROM_ENTITY_TABLE_NAMES.FILES);

  const currentFolder = useRouterQuery('folder');
  const currentPath = useMemo(
    () => (currentFolder || '/').replaceAll('//', '/'),
    [currentFolder]
  );
  const navigate = useNavigate();

  const handleFolderChange = useCallback(
    (value: string) => {
      navigate({
        search: `?folder=${value}`,
      });
    },
    [navigate]
  );

  if (!model)
    return <NotFoundPage text={t('This model with this id does not exist.')} />;

  return (
    <UnderpageLayout>
      <PageLayout>
        <div className="flex w-full flex-col justify-between gap-5 pt-3 pb-4 md:flex-row">
          <h1 className="text-3xl font-semibold capitalize my-0">
            {t(model.tableName || '')}
          </h1>
        </div>
        <FileList
          currentFolder={currentPath}
          onFolderChange={handleFolderChange}
        />
        <Outlet />
      </PageLayout>
    </UnderpageLayout>
  );
};

export default FilesPage;
