import { apiClient } from '@api';
import BackendImage from '@components/BackendImage';
import { Page } from '@custom-types';
import { Divider, Drawer, Input, Title } from '@mantine/core';
import { useModelItem } from 'hooks/useModelItem';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { FileItem } from '@prom-cms/api-client';

import { CopyToClipboard } from './components';

const FilePage: Page = () => {
  const { t } = useTranslation();
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useModelItem<FileItem>('files', fileId as string);

  const fileUrl = useMemo(
    () => !!fileId && apiClient.files.getAssetUrl(fileId!),
    [fileId]
  );

  const isImage = useMemo(() => data?.mimeType?.startsWith('image/'), [data]);

  const handleClose = () => {
    if (!data) {
      return;
    }

    const folderName = data.filepath.split('/').slice(0, -1).join('/');
    let pathname = '/files';

    if (folderName) {
      pathname += `?folder=/${folderName}`;
    }

    navigate(pathname);
  };

  return (
    <Drawer
      size="xl"
      opened={true}
      onClose={handleClose}
      padding="xl"
      position="right"
      closeButtonLabel={t('Close')}
      title={
        <Title order={4}>
          {isLoading ? (
            t('Loading, please wait...')
          ) : (
            <>
              File info of &apos;
              <span className="text-blue-500">{data!.filename}</span>
              &apos;
            </>
          )}
        </Title>
      }
    >
      {!isLoading && data && !!fileUrl ? (
        <>
          <Divider mb="lg" mt="sm" size="sm" />

          {isImage ? (
            <Input.Wrapper
              label={t('File preview')}
              className="py-3"
              labelProps={{
                className: 'font-semibold',
              }}
            >
              <BackendImage
                quality={80}
                width={450}
                imageId={fileId}
                className="mb-3 w-full"
              />
            </Input.Wrapper>
          ) : null}

          <CopyToClipboard fileUrl={fileUrl} />
        </>
      ) : null}
    </Drawer>
  );
};

export default FilePage;
