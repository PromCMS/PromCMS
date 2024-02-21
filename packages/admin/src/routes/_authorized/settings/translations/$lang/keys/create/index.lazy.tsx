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
          title: t(MESSAGES.PLEASE_WAIT),
          message: t(MESSAGES.TRANSLATION_CREATE_WORKING),
          successMessage: t(MESSAGES.TRANSLATION_CREATE_DONE),
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
      title={t(MESSAGES.TRANSLATION_CREATE_PAGE_TITLE)}
    >
      <FormProvider {...formMethods}>
        <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
          <LanguageSelect
            disabled
            label={t(MESSAGES.FOR_LANGUAGE)}
            value={lang}
          />
          <TextInput
            label={t(MESSAGES.TRANSLATION_KEY)}
            mt={'sm'}
            {...register('key', {
              min: { value: 1, message: t(MESSAGES.FIELD_REQUIRED) },
            })}
          />
          <TextInput
            label={t(MESSAGES.TRANSLATION_VALUE)}
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
            {t(MESSAGES.CREATE_ITEM)}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
}
