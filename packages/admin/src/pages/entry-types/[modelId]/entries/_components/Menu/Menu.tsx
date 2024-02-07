import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import {
  ActionIcon,
  Button,
  Menu as MantineMenu,
  Tooltip,
} from '@mantine/core';
import { getObjectDiff } from '@utils';
import clsx from 'clsx';
import useCurrentModel from 'hooks/useCurrentModel';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useMemo, useState } from 'react';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dots, Trash, World } from 'tabler-icons-react';

import { useEntryUnderpageContext } from '../../_context';

const MoreOptions: FC = () => {
  const { formState } = useFormContext();
  const { t } = useTranslation();
  const { itemData, currentView, exitView } = useEntryUnderpageContext();
  const currentModel = useCurrentModel();
  const currentUser = useCurrentUser();
  const [hideTooltip, setHideTooltip] = useState(false);

  const showDeleteButton =
    currentView === 'update' &&
    currentModel &&
    currentUser?.can({
      action: 'create',
      targetEntityTableName: currentModel?.name,
    });

  const onItemDeleteRequest = async () => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      exitView();
      await apiClient.entries.for(currentModel?.name!).delete(itemData?.id!);
    }
  };

  return (
    <MantineMenu
      withArrow
      arrowPosition="center"
      position="bottom-end"
      onOpen={() => setHideTooltip(true)}
      onClose={() => setHideTooltip(false)}
    >
      <MantineMenu.Target>
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
          >
            <Dots className="aspect-square w-20 duration-150" />
          </ActionIcon>
        </Tooltip>
      </MantineMenu.Target>
      <MantineMenu.Dropdown>
        {showDeleteButton ? (
          <MantineMenu.Item
            type="button"
            onClick={onItemDeleteRequest}
            color="red"
            className={clsx(formState.isSubmitting && '!cursor-progress')}
            icon={<Trash className="aspect-square w-4" />}
          >
            {t(MESSAGES.PURGE_DATA)}
          </MantineMenu.Item>
        ) : null}
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
};

export const Menu: FC = () => {
  const { watch } = useFormContext();
  const formValues = watch();
  const { t } = useTranslation();
  const { itemData, currentView } = useEntryUnderpageContext();
  const currentModel = useCurrentModel();
  const { setValue, formState } = useFormContext();

  const isEdited = useMemo(
    () =>
      currentView === 'update'
        ? !!Object.keys(getObjectDiff(itemData || {}, formValues)).length
        : true,
    [formValues, currentView, itemData]
  );

  const handleSaveButtonClick = () => {
    if (currentView === 'create') {
      setValue('is_published', true);
    }
  };

  const saveButtonText = useMemo(() => {
    let text = '';

    if (currentView === 'create') {
      if (formState.isSubmitting) {
        text = 'Publishing';
      } else {
        text = 'Publish';
      }
    } else if (currentView === 'update') {
      if (formState.isSubmitting) {
        text = 'Updating';
      } else {
        text = 'Update';
      }
    }

    return t(text);
  }, [currentView, formState.isSubmitting, t]);

  const publishButtonText = useMemo(() => {
    let text = '';

    // We dont have to compute more so we end prematurely
    if (!currentModel?.draftable) return text;

    if (currentView === 'create') {
      if (formState.isSubmitting) {
        text = 'Saving';
      } else {
        text = 'Save as concept';
      }
    } else if (currentView === 'update') {
      if (!itemData) return text;

      if (itemData.is_published) {
        text = 'Unpublish';
      } else {
        text = 'Publish';
      }
    }

    return t(text);
  }, [currentView, formState.isSubmitting, currentModel, itemData, t]);

  const handlePublishButtonClick = () => {
    setValue('is_published', itemData ? !itemData.is_published : false);
  };

  return (
    <nav className="align-center sticky bottom-1 left-0 z-10 mx-auto flex max-h-20 items-center justify-between p-2 rounded-prom bg-transparent">
      <div className="flex gap-3 justify-center"></div>

      <div className="flex items-center gap-3">
        {currentModel?.draftable && (
          <Button
            size="sm"
            variant="white"
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
        <Tooltip
          withArrow
          label={t(MESSAGES.LOCALIZE)}
          position="bottom"
          color="gray"
        >
          <ActionIcon
            size="xl"
            type="button"
            loading={formState.isSubmitting}
            color="blue"
            variant="light"
            styles={{
              root: {
                width: 50,
                height: 50,
              },
            }}
            className={clsx(formState.isSubmitting && '!cursor-progress')}
          >
            <World className="aspect-square w-10" />
          </ActionIcon>
        </Tooltip>
        <MoreOptions />
      </div>
    </nav>
  );
};
