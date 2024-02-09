import { FileList } from '@components/FileList';
import { BASE_PROM_ENTITY_TABLE_NAMES } from '@constants';
import { useModelInfo } from '@hooks/useModelInfo';
import { PageLayout } from '@layouts/PageLayout';
import {
  Outlet,
  createLazyFileRoute,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-router';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FilesOverviewRoute } from '.';

export const Route = createLazyFileRoute('/_authorized/files/')({
  component: FilesOverviewPage,
});

function FilesOverviewPage() {
  const { t } = useTranslation();
  const model = useModelInfo(BASE_PROM_ENTITY_TABLE_NAMES.FILES);
  const navigate = useNavigate();
  const router = useRouter();
  const search = useSearch({
    from: FilesOverviewRoute.id,
  });

  const currentFolder = search.folder;
  const currentPath = useMemo(
    () => (currentFolder || '/').replaceAll('//', '/'),
    [currentFolder]
  );

  const handleFolderChange = useCallback(
    (value: string) => {
      navigate({
        to: router.history.location.pathname,
        search: {
          folder: value,
        },
      });
    },
    [navigate]
  );

  return (
    <PageLayout>
      <PageLayout.Header
        title={t(model?.tableName || '')}
        classNames={{ wrapper: clsx('') }}
      />
      <div className="max-w-[1760px] mx-auto mb-20">
        <FileList
          currentFolder={currentPath}
          onFolderChange={handleFolderChange}
        />
      </div>
      <Outlet />
    </PageLayout>
  );
}
