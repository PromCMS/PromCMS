import { apiClient } from '@api';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { MESSAGES } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { Button, Modal, TextInput } from '@mantine/core';
import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useRequestWithNotifications } from 'hooks/useRequestWithNotifications';
import { useCallback, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TranslationsForLanguageRoute } from '../../index';

type FormValues = { key: string; value: string };

export const Route = createLazyFileRoute(
  '/_authorized/settings/translations/$lang/keys/create/'
)({
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const settings = useSettings();
  const formMethods = useForm<FormValues>();
  const reqWithNotification = useRequestWithNotifications();
  const { lang } = useParams({
    from: TranslationsForLanguageRoute.id,
  });
  const { t } = useTranslation();
  const { handleSubmit, formState, register } = formMethods;

  const onClose = useCallback(
    () => navigate({ to: `/settings/translations/${lang}` }),
    [navigate]
  );

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
    if (
      lang &&
      settings &&
      !settings.application?.i18n.languages.includes(lang)
    ) {
      navigate({ to: '/404' });
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
      title={t('Create translation key')}
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
            mt={'lg'}
            size="md"
          >
            {t('Create')}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
}
