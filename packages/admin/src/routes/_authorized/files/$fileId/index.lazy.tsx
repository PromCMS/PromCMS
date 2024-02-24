import { apiClient } from '@api';
import BackendImage from '@components/BackendImage';
import { MESSAGES } from '@constants';
import { PageLayout } from '@layouts/PageLayout';
import { ActionIcon, Button, Input, Paper, Textarea } from '@mantine/core';
import {
  Link,
  createLazyFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash } from 'tabler-icons-react';

import { CopyToClipboard } from './-components';
import { FileUnderpageRoute } from './index';

export const Route = createLazyFileRoute('/_authorized/files/$fileId/')({
  component: Page,
});

function Page() {
  const form = useForm();
  const data = useLoaderData({
    from: FileUnderpageRoute.id,
  });
  const { t } = useTranslation();
  const { register } = form;

  const fileUrl = useMemo(
    () => !!data.id && apiClient.library.files.getUrl(data.id!),
    [data]
  );

  const isImage = useMemo(() => data?.mimeType?.startsWith('image/'), [data]);
  const baseName = data.filepath.split('/').slice(0, -1).join('/');
  const fileExtension = data!.filename?.split('.').at(-1);

  let goBackUrl = '/files';
  if (baseName) {
    goBackUrl += `?folder=/${baseName}`;
  }

  return (
    <PageLayout>
      <div className="container mx-auto">
        <Button
          component={Link}
          to={goBackUrl}
          leftSection={<ArrowLeft />}
          color="red"
          variant="subtle"
          className="-ml-5"
        >
          {t(MESSAGES.GO_BACK)}
        </Button>
      </div>
      <PageLayout.Header
        title={<span className="text-blue-500">{data!.filename}</span>}
        classNames={{
          wrapper: 'flex items-center justify-between',
        }}
      >
        {/* <div className="flex gap-2">
          <Button color="green" size="md">
            {t(MESSAGES.SAVE)}
          </Button>
          <ActionIcon color="red" size={42}>
            <Trash />
          </ActionIcon>
        </div> */}
      </PageLayout.Header>
      <PageLayout.Content>
        <FormProvider {...form}>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-none max-w-sm w-full">
              {isImage ? (
                <Input.Wrapper size="md" label={t(MESSAGES.FILE_PREVIEW)}>
                  <BackendImage
                    quality={80}
                    width={450}
                    imageId={data.id}
                    className="mb-3 w-full"
                  />
                </Input.Wrapper>
              ) : (
                <Paper className="aspect-square bg-blue-50 flex items-center justify-center text-4xl">
                  .{fileExtension}
                </Paper>
              )}
            </div>
            <div className="w-full">
              {!!fileUrl ? <CopyToClipboard fileUrl={fileUrl} /> : null}
              {/* <Textarea
                className="mt-3"
                label={t(MESSAGES.DESCRIPTION)}
                rows={8}
                placeholder={t(MESSAGES.DESCRIPTION_PLACEHOLDER)}
                {...register('description')}
              /> */}
            </div>
          </div>
        </FormProvider>
      </PageLayout.Content>
    </PageLayout>
  );
}
