import { FileList } from '@components/FileList';
import { Page } from '@custom-types';
import { useModelInfo } from '@hooks/useModelInfo';
import { useRouterQuery } from '@hooks/useRouterQuery';
import { PageLayout } from '@layouts';
import { upperFirst } from '@mantine/hooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import NotFoundPage from '../404';

const FilesPage: Page = () => {
  const { t } = useTranslation();
  const model = useModelInfo('files');

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
    <PageLayout>
      <div className="flex w-full flex-col justify-between gap-5 py-10 md:flex-row">
        <h1 className="text-3xl font-semibold capitalize">
          {t(upperFirst(model.tableName || ''))}
        </h1>
      </div>
      <FileList
        currentFolder={currentPath}
        onFolderChange={handleFolderChange}
      />
      <Outlet />
    </PageLayout>
  );
};

export default FilesPage;
