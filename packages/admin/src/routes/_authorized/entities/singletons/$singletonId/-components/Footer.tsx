import { MESSAGES } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { ActionIcon, Button, Menu, Tooltip } from '@mantine/core';
import { getObjectDiff } from '@utils';
import clsx from 'clsx';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import { useMemo, useState } from 'react';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dots, Trash } from 'tabler-icons-react';

import { useSingletonPageContext } from '../-context';
import { LanguageMutation } from '../../../$modelId/$entryId/-components/Menu/LanguageMutation';

const MoreOptions: FC = () => {
  const { formState, reset } = useFormContext();
  const { t } = useTranslation();
  const { clear } = useSingletonPageContext();
  const [hideTooltip, setHideTooltip] = useState(false);

  const onItemDeleteRequest = async () => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      await clear();
      reset();
    }
  };

  return (
    <Menu
      withArrow
      arrowPosition="center"
      position="bottom-end"
      onOpen={() => setHideTooltip(true)}
      onClose={() => setHideTooltip(false)}
    >
      <Menu.Target>
        <Tooltip
          withArrow
          label={t(MESSAGES.MORE_OPTIONS_BUTTON_TEXT)}
          position="bottom-end"
          arrowPosition="center"
          color="gray"
          disabled={hideTooltip}
        >
          <ActionIcon
            size="xl"
            color="gray"
            variant="light"
            type="button"
            className={clsx(formState.isSubmitting && '!cursor-progress')}
            loading={formState.isSubmitting}
            styles={{
              root: {
                width: 50,
                height: 50,
              },
            }}
          >
            <Dots className={'aspect-square w-20 duration-150'} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          type="button"
          onClick={onItemDeleteRequest}
          color="red"
          className={clsx(formState.isSubmitting && '!cursor-progress')}
          leftSection={<Trash className="aspect-square w-4" />}
        >
          {t(MESSAGES.PURGE_DATA)}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export const Footer: FC<{}> = () => {
  const { watch } = useFormContext();
  const formValues = watch();
  const { t } = useTranslation();
  const { data, setLanguage, language } = useSingletonPageContext();
  const currentModel = useCurrentSingleton();
  const settings = useSettings();
  const { setValue, formState } = useFormContext();

  const isEdited = useMemo(
    () => !!Object.keys(getObjectDiff(data || {}, formValues)).length,
    [formValues, data]
  );

  const handleSaveButtonClick = () => {
    // if (currentView === 'create') {
    //   setValue('is_published', true);
    // }
  };

  const saveButtonText = useMemo(() => {
    let text = '';

    if (formState.isSubmitting) {
      text = 'Updating';
    } else {
      text = 'Update';
    }

    return t(text);
  }, [formState.isSubmitting, t]);

  const publishButtonText = useMemo(() => {
    let text = '';

    // We dont have to compute more so we end prematurely
    if (!currentModel?.draftable) return text;

    if (!data) return text;

    if (data.published) {
      text = 'Unpublish';
    } else {
      text = 'Publish';
    }

    return t(text);
  }, [data, formState.isSubmitting, currentModel, t]);

  const handlePublishButtonClick = () => {
    setValue('published', data ? !data.published : false);
  };

  const localizedFields = useMemo(
    () => currentModel?.columns.filter((item) => item.localized),
    [currentModel]
  );

  return (
    <nav className="align-center sticky bottom-1 left-0 z-10 mx-auto flex max-h-20 items-center justify-end gap-2 px-5 rounded-prom bg-transparent">
      {currentModel?.draftable && (
        <Button
          size="sm"
          variant="transparent"
          type="submit"
          disabled={formState.isSubmitting}
          className="ml-auto"
          onClick={handlePublishButtonClick}
          px="sm"
        >
          {publishButtonText}
        </Button>
      )}

      <Button
        size="lg"
        color="green"
        type="submit"
        disabled={!isEdited}
        loading={formState.isSubmitting}
        onClick={handleSaveButtonClick}
      >
        {saveButtonText}
      </Button>
      {(settings.application?.i18n.languages.length ?? 0) > 1 &&
      !!localizedFields?.length ? (
        <LanguageMutation language={language ?? ''} onSelect={setLanguage} />
      ) : null}
      <MoreOptions />
    </nav>
  );
};
