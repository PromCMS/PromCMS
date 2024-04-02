import { apiClient } from '@api';
import BackendImage from '@components/BackendImage';
import { MESSAGES } from '@constants';
import { PageLayout } from '@layouts/PageLayout';
import { ActionIcon, Button, Input, Paper, Textarea } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import {
  Link,
  createLazyFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import clsx from 'clsx';
import { useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash } from 'tabler-icons-react';

import { FileItem } from '@prom-cms/api-client';

import { CopyToClipboard } from './-components';
import { FileSystemPath } from './-components/FileSystemPath';
import { Filename } from './-components/Filename';
import { FileUnderpageRoute } from './index';

export const Route = createLazyFileRoute('/_authorized/files/$fileId/')({
  component: Page,
});

const getBaseName = (data: FileItem) =>
  data.filepath.split('/').slice(0, -1).join('/');
const getBackUrl = (data: FileItem) => {
  const baseName = getBaseName(data);

  let goBackUrl = '/files';
  if (baseName) {
    goBackUrl += `?folder=/${baseName}`;
  }

  return goBackUrl;
};

function Page() {
  const data = useLoaderData({
    from: FileUnderpageRoute.id,
  });
  const form = useForm<FileItem>({
    defaultValues: data,
  });
  const { register, formState, handleSubmit, control } = form;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: deleteItemAndGoBack, isLoading: isDeleting } =
    useMutation({
      async mutationFn(item: FileItem) {
        if (!confirm(t(MESSAGES.DELETE_FILE_QUESTION))) {
          return;
        }

        await apiClient.library.files.delete(item.id).then(({ data }) => data);

        await navigate({
          to: getBackUrl(item),
        });
      },
    });

  const fileUrl = useMemo(
    () => !!data.id && apiClient.library.files.getUrl(data.id!),
    [data]
  );

  const isEdited = formState.isDirty;
  const isImage = useMemo(() => data?.mimeType?.startsWith('image/'), [data]);
  const goBackUrl = getBackUrl(data);
  const fileExtension = data!.filename?.split('.').at(-1);
  const fieldsAreDisabled = isDeleting || formState.isSubmitting;

  const filename = useWatch({
    name: 'filename',
    control,
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!data) {
      return;
    }

    await apiClient.library.files.update(data.id, {
      description: values.description,
      filename: values.filename,
    });
  });

  return (
    <FormProvider {...form}>
      <PageLayout>
        <form autoComplete="false" onSubmit={onSubmit}>
          <div className="container mx-auto">
            <Button
              component={Link}
              to={goBackUrl}
              leftSection={<ArrowLeft />}
              color="red"
              variant="subtle"
              className="-ml-5"
              disabled={formState.isSubmitting || isDeleting}
            >
              {t(MESSAGES.GO_BACK)}
            </Button>
          </div>
          <PageLayout.Header
            title={
              <span className="text-blue-500 break-all">
                {filename ?? data?.filename}
              </span>
            }
            classNames={{
              wrapper: clsx(
                'flex items-start justify-between mt-6 mb-4 max-w-full gap-8'
              ),
            }}
          >
            <div className="flex gap-2 mt-6">
              <Button
                color="green"
                size="md"
                type="submit"
                disabled={!isEdited || isDeleting}
                loading={formState.isSubmitting}
              >
                {t(MESSAGES.SAVE)}
              </Button>
              <ActionIcon
                color="red"
                size={42}
                onClick={() => deleteItemAndGoBack(data)}
                disabled={formState.isSubmitting}
                loading={isDeleting}
                variant="subtle"
              >
                <Trash />
              </ActionIcon>
            </div>
          </PageLayout.Header>
          <PageLayout.Content>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-none sm:max-w-60 md:max-w-sm w-full flex flex-col gap-4">
                {!!fileUrl ? <CopyToClipboard fileUrl={fileUrl} /> : null}
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
              <div className="w-full flex flex-col gap-3">
                <FileSystemPath file={data} />
                <Filename file={data} />
                <Textarea
                  label={t(MESSAGES.DESCRIPTION)}
                  rows={8}
                  placeholder={t(MESSAGES.DESCRIPTION_PLACEHOLDER)}
                  disabled={fieldsAreDisabled}
                  {...register('description')}
                />
              </div>
            </div>
          </PageLayout.Content>
        </form>
      </PageLayout>
    </FormProvider>
  );
}
