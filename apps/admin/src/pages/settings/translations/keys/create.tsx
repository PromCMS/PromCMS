import { Page } from '@custom-types';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import { Button, Modal, TextInput, Title } from '@mantine/core';
import { EntryService } from '@services';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const CreateTranslationSettings: Page = () => {
  const navigate = useNavigate();
  const formMethods = useForm<{ title: string }>();
  const { t } = useTranslation();
  const reqWithNotification = useRequestWithNotifications();
  const { handleSubmit, formState, register, watch } = formMethods;

  const onClose = useCallback(() => navigate(-1), [navigate]);
  const titleValue = watch('title');

  const onSubmit = async (values) => {
    try {
      reqWithNotification(
        {
          title: t('Creating translation key'),
          message: t('Please wait...'),
          successMessage: t('Translation key successfully created'),
        },
        async () => {
          await EntryService.create(
            { model: 'generalTranslations' },
            { key: values.title }
          );
          onClose();
        }
      );
    } catch (e) {}
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      centered
      padding={32}
      size={500}
      className="overflow-auto"
      title={<Title order={4}>{t('Create translation key')}</Title>}
    >
      <FormProvider {...formMethods}>
        <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label={t('Key title')}
            {...register('title', {
              min: { value: 1, message: 'This field is required' },
            })}
          />
          <TextInput
            disabled
            label={t('Value')}
            mt={'sm'}
            value={titleValue ?? ''}
            description={t('This is an initial translation key value')}
          />
          <Button
            className="mr-auto block"
            type="submit"
            loading={formState.isSubmitting}
            loaderPosition="right"
            mt={'lg'}
          >
            {t('Create')}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};
