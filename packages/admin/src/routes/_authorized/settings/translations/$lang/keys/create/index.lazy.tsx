import { apiClient } from '@api';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { MESSAGES, pageUrls } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { PageLayout } from '@layouts/PageLayout';
import { Button, Textarea } from '@mantine/core';
import {
  Link,
  createLazyFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useRequestWithNotifications } from 'hooks/useRequestWithNotifications';
import { useCallback, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowLeft, ArrowRight } from 'tabler-icons-react';

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

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      reqWithNotification(
        {
          title: t(MESSAGES.PLEASE_WAIT),
          message: t(MESSAGES.TRANSLATION_CREATE_WORKING),
          successMessage: t(MESSAGES.TRANSLATION_CREATE_DONE),
        },
        async () => {
          await apiClient.generalTranslations.upsert(
            values.key,
            values.value,
            lang!
          );

          await navigate({ to: pageUrls.settings.translations(lang).list });
        }
      );
    } catch (e) {}
  };

  const onLanguageChange = (nextValue) => {
    navigate({ to: pageUrls.settings.translations(nextValue).create });
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
    <PageLayout>
      <div className="container mx-auto">
        <Button
          component={Link}
          to={pageUrls.settings.translations(lang).list}
          leftSection={<ArrowLeft />}
          color="red"
          variant="subtle"
          className="-ml-5"
        >
          {t(MESSAGES.GO_BACK)}
        </Button>
      </div>
      <PageLayout.Header
        title={t(MESSAGES.TRANSLATION_CREATE_PAGE_TITLE)}
      ></PageLayout.Header>
      <PageLayout.Content>
        <FormProvider {...formMethods}>
          <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full">
                <LanguageSelect
                  disabled
                  label={t(MESSAGES.FROM_LANGUAGE)}
                  value={settings.application?.i18n.default}
                />
                <Textarea
                  label={t(MESSAGES.TRANSLATION_KEY)}
                  mt={'sm'}
                  minRows={4}
                  autosize
                  description={t(MESSAGES.CREATE_TRANSLATION_KEY_KEY_DESC)}
                  {...register('key', {
                    min: { value: 1, message: t(MESSAGES.FIELD_REQUIRED) },
                  })}
                />
              </div>
              <div className="flex-none flex items-center justify-center my-7 md:mx-5 lg:mx-10">
                <ArrowRight
                  className="text-blue-300 hidden md:block"
                  size={30}
                />
                <ArrowDown
                  className="text-blue-300 md:hidden block"
                  size={30}
                />
              </div>
              <div className="w-full">
                <LanguageSelect
                  disabledOptions={[settings.application?.i18n.default!]}
                  label={t(MESSAGES.FOR_LANGUAGE)}
                  value={lang}
                  onChange={onLanguageChange}
                  tabIndex={-1}
                />
                <Textarea
                  label={t(MESSAGES.TRANSLATION_VALUE)}
                  mt={'sm'}
                  minRows={4}
                  autosize
                  description={t(MESSAGES.CREATE_TRANSLATION_KEY_VALUE_DESC)}
                  {...register('value', {
                    min: { value: 1, message: t(MESSAGES.FIELD_REQUIRED) },
                  })}
                />
              </div>
            </div>
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
      </PageLayout.Content>
    </PageLayout>
  );
}
