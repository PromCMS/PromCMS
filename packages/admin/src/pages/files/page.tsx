import { Page } from '@custom-types';
import { useModelInfo } from '@hooks/useModelInfo';
import { PageLayout } from '@layouts';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import NotFoundPage from '../404';
import { FileList } from './_components';

const FilesPage: Page = () => {
  const { t } = useTranslation();
  const model = useModelInfo('files');

  if (!model)
    return <NotFoundPage text={t('This model with this id does not exist.')} />;

  return (
    <PageLayout>
      <div className="flex w-full flex-col justify-between gap-5 py-10 md:flex-row">
        <h1 className="text-3xl font-semibold capitalize">
          {t(model.tableName || '')}
        </h1>
      </div>
      <FileList />
      <Outlet />
    </PageLayout>
  );
};

export default FilesPage;
