import { FloatingFooter } from '@components/editorialPage/FloatingFooter';
import { MESSAGES } from '@constants';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { ActionIcon, Button, Paper, Tooltip } from '@mantine/core';
import { getObjectDiff } from '@utils';
import clsx from 'clsx';
import { useMemo } from 'react';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Trash } from 'tabler-icons-react';
import { useSingletonPageContext } from '../context';

export const Footer: FC<{}> = () => {
  const { watch } = useFormContext();
  const formValues = watch();
  const { t } = useTranslation();
  const { data, clear } = useSingletonPageContext();
  const currentModel = useCurrentSingleton();
  const { setValue, formState } = useFormContext();

  const isEdited = useMemo(
    () => !!Object.keys(getObjectDiff(data || {}, formValues)).length,
    [formValues, data]
  );

  const onItemDeleteRequest = async () => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      await clear();
    }
  };

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
    if (!currentModel?.isDraftable) return text;

    if (!data) return text;

    if (data.is_published) {
      text = 'Unpublish';
    } else {
      text = 'Publish';
    }

    return t(text);
  }, [data, formState.isSubmitting, currentModel, t]);

  const handlePublishButtonClick = () => {
    setValue('is_published', data ? !data.is_published : false);
  };

  return (
    <FloatingFooter isSubmitting={formState.isSubmitting}>
      <Tooltip withArrow label={t('Clean data')} position="top" color="gray">
        <ActionIcon
          size="xl"
          type="button"
          loading={formState.isSubmitting}
          onClick={onItemDeleteRequest}
          color="red"
          variant="light"
          styles={{
            root: {
              width: 50,
              height: 50,
            },
          }}
          className={clsx(formState.isSubmitting && '!cursor-progress')}
        >
          <Trash className="aspect-square w-10" />
        </ActionIcon>
      </Tooltip>
      <div className="flex items-center gap-3">
        {currentModel?.isDraftable && (
          <Button
            size="sm"
            variant="white"
            type="submit"
            disabled={formState.isSubmitting}
            className="ml-auto"
            onClick={handlePublishButtonClick}
            px={'sm'}
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
      </div>
    </FloatingFooter>
  );
};
