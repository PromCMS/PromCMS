import { apiClient } from '@api';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { MESSAGES } from '@constants';
import { Page } from '@custom-types';
import { Button, Modal, TextInput, Title } from '@mantine/core';
import { useRequestWithNotifications } from 'hooks/useRequestWithNotifications';
import { useSettings } from 'hooks/useSettings';
import { useCallback, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

type FormValues = { key: string; value: string };

export const CreateTranslationSettings: Page = () => {
  const navigate = useNavigate();
  const settings = useSettings();
  const formMethods = useForm<FormValues>();
  const reqWithNotification = useRequestWithNotifications();
  const { lang } = useParams();
  const { t } = useTranslation();
  const { handleSubmit, formState, register } = formMethods;

  const onClose = useCallback(() => navigate(-1), [navigate]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      reqWithNotification(
        {
          title: t('Creating translation key'),
          message: t('Please wait...'),
          successMessage: t('Translation key successfully created'),
        },
        async () => {
          await apiClient.generalTranslations.update(
            values.key,
            values.value,
            lang!
          );
          onClose();
        }
      );
    } catch (e) {}
  };

  useEffect(() => {
    if (lang && settings && !settings.i18n.languages.includes(lang)) {
      navigate('/404');
    }
  }, [lang, settings]);

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
          <LanguageSelect
            disabled
            label={t(MESSAGES.FOR_LANGUAGE)}
            value={lang}
          />
          <TextInput
            label={t('Key title')}
            mt={'sm'}
            {...register('key', {
              min: { value: 1, message: t(MESSAGES.FIELD_REQUIRED) },
            })}
          />
          <TextInput
            label={t('Value')}
            mt={'sm'}
            description={t(MESSAGES.CREATE_TRANSLATION_KEY_VALUE_DESC)}
            {...register('value', {
              min: { value: 1, message: t(MESSAGES.FIELD_REQUIRED) },
            })}
          />
          <Button
            className="mr-auto block"
            type="submit"
            loading={formState.isSubmitting}
            loaderPosition="right"
            mt={'lg'}
            size="md"
          >
            {t('Create')}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};
