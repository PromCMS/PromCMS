import { MESSAGES } from '@constants'
import useCurrentModel from '@hooks/useCurrentModel'
import { useCurrentUser } from '@hooks/useCurrentUser'
import { ActionIcon, Button, Paper, Tooltip } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { EntryService } from '@services'
import { getObjectDiff } from '@utils'
import clsx from 'clsx'
import { useMemo } from 'react'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEntryUnderpageContext } from '../context'

export const Footer: FC<{}> = () => {
  const { watch } = useFormContext()
  const formValues = watch()
  const { t } = useTranslation()
  const { itemData, currentView, setAsideOpen, asideOpen, exitView } =
    useEntryUnderpageContext()
  const currentModel = useCurrentModel()
  const currentUser = useCurrentUser()
  const { setValue, formState } = useFormContext()

  const isEdited = useMemo(
    () =>
      currentView === 'update'
        ? !!Object.keys(getObjectDiff(itemData || {}, formValues)).length
        : true,
    [formValues, currentView, itemData]
  )

  const onItemDeleteRequest = async () => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      exitView()
      await EntryService.delete({
        id: itemData?.id as string,
        model: currentModel?.name as string,
      })
    }
  }

  const handleSaveButtonClick = () => {
    if (currentView === 'create') {
      setValue('is_published', true)
    }
  }

  const saveButtonText = useMemo(() => {
    let text = ''

    if (currentView === 'create') {
      if (formState.isSubmitting) {
        text = 'Publishing'
      } else {
        text = 'Publish'
      }
    } else if (currentView === 'update') {
      if (formState.isSubmitting) {
        text = 'Updating'
      } else {
        text = 'Update'
      }
    }

    return t(text)
  }, [currentView, formState.isSubmitting, t])

  const publishButtonText = useMemo(() => {
    let text = ''

    // We dont have to compute more so we end prematurely
    if (!currentModel?.isDraftable) return text

    if (currentView === 'create') {
      if (formState.isSubmitting) {
        text = 'Saving'
      } else {
        text = 'Save as concept'
      }
    } else if (currentView === 'update') {
      if (!itemData) return text

      if (itemData.is_published) {
        text = 'Unpublish'
      } else {
        text = 'Publish'
      }
    }

    return t(text)
  }, [currentView, formState.isSubmitting, currentModel, itemData, t])

  const handlePublishButtonClick = () => {
    setValue('is_published', itemData ? !itemData.is_published : false)
  }

  return (
    <Paper
      shadow="lg"
      component="footer"
      className="align-center container sticky bottom-1 left-0 z-10 mx-auto flex max-h-20 items-center justify-between border-2 border-project-border p-3"
    >
      {currentView === 'update' &&
      currentModel &&
      currentUser?.can({
        action: 'create',
        targetModel: currentModel?.name,
      }) ? (
        <Tooltip withArrow label={t('Delete')} position="top" color="gray">
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
            <iconSet.Trash className="aspect-square w-10" />
          </ActionIcon>
        </Tooltip>
      ) : (
        <span></span>
      )}
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
        <Tooltip
          withArrow
          label={t('Toggle more options')}
          position="top"
          color="gray"
        >
          <ActionIcon
            size="xl"
            color="blue"
            variant="light"
            type="button"
            className={clsx(formState.isSubmitting && '!cursor-progress')}
            styles={{
              root: {
                width: 50,
                height: 50,
              },
            }}
            onClick={() => setAsideOpen((prev) => !prev)}
          >
            <iconSet.ChevronLeft
              className={clsx(
                'aspect-square w-20 duration-150',
                asideOpen && 'rotate-180'
              )}
            />
          </ActionIcon>
        </Tooltip>
      </div>
    </Paper>
  )
}
