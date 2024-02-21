import { apiClient } from '@api';
import BackendImage from '@components/BackendImage';
import { MESSAGES } from '@constants';
import { Divider, Drawer, Input, Title } from '@mantine/core';
import {
  createLazyFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CopyToClipboard } from './-components';
import { FileUnderpageRoute } from './index';

export const Route = createLazyFileRoute('/_authorized/files/$fileId/')({
  component: Page,
});

function Page() {
  const data = useLoaderData({
    from: FileUnderpageRoute.id,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fileUrl = useMemo(
    () => !!data.id && apiClient.library.files.getUrl(data.id!),
    [data]
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

    navigate({ to: pathname });
  };

  return (
    <Drawer
      size="xl"
      opened={true}
      onClose={handleClose}
      padding="xl"
      position="right"
      closeButtonProps={{ 'aria-label': t(MESSAGES.CLOSE) }}
      title={
        <Title order={4}>
          <>
            File info of &apos;
            <span className="text-blue-500">{data!.filename}</span>
            &apos;
          </>
        </Title>
      }
    >
      {!!fileUrl ? (
        <>
          <Divider mb="lg" mt="sm" size="sm" />

          {isImage ? (
            <Input.Wrapper
              label={t(MESSAGES.FILE_PREVIEW)}
              className="py-3"
              labelProps={{
                className: 'font-semibold',
              }}
            >
              <BackendImage
                quality={80}
                width={450}
                imageId={data.id}
                className="mb-3 w-full"
              />
            </Input.Wrapper>
          ) : null}

          <CopyToClipboard fileUrl={fileUrl} />
        </>
      ) : null}
    </Drawer>
  );
}
