import AsideItemWrap from '@components/AsideItemWrap'
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper'
import Skeleton, { SkeltonProps } from '@components/Skeleton'
import useCurrentModel from '@hooks/useCurrentModel'
import { ColumnType, ModelColumnName } from '@prom-cms/shared'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { MESSAGES } from '@constants'
import { EntryService } from '@services'
import { useMemo, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getObjectDiff } from '@utils'
import { useEntryUnderpageContext } from './context'
import { useClassNames } from './useClassNames'
import { iconSet } from '@prom-cms/icons'
import { ActionIcon, Button, Group } from '@mantine/core'

const TextSkeleton: VFC<SkeltonProps> = ({ className, ...rest }) => (
  <Skeleton
    className={clsx('relative top-0.5 inline-block h-4', className)}
    {...rest}
  />
)

const dateFormat = 'D.M. YYYY @ HH:mm'

export const FormAside: VFC<{ isSubmitting: boolean }> = ({ isSubmitting }) => {
  const { itemData, itemIsLoading, currentView, exitView } =
    useEntryUnderpageContext()
  const currentModel = useCurrentModel()
  const { watch, setValue } = useFormContext()
  const formValues = watch()
  const classes = useClassNames()
  const { t } = useTranslation()

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

  const groupedFields = useMemo<
    Array<ColumnType & { columnName: ModelColumnName }>[] | undefined
  >(() => {
    if (!currentModel) return

    const { title, content, ...columns } = currentModel.columns

    return prepareFieldsForMapper({ ...currentModel, columns })
  }, [currentModel])

  const saveButtonText = useMemo(() => {
    let text = ''

    if (currentView === 'create') {
      if (isSubmitting) {
        text = 'Publishing'
      } else {
        text = 'Publish'
      }
    } else if (currentView === 'update') {
      if (isSubmitting) {
        text = 'Updating'
      } else {
        text = 'Update'
      }
    }

    return t(text)
  }, [currentView, isSubmitting, t])

  const publishButtonText = useMemo(() => {
    let text = ''

    // We dont have to compute more so we end prematurely
    if (!currentModel?.isDraftable) return text

    if (currentView === 'create') {
      if (isSubmitting) {
        text = 'Saving'
      } else {
        text = 'Save as concept'
      }
    } else if (currentView === 'update') {
      if (itemData!.is_published) {
        text = 'Unpublish'
      } else {
        text = 'Publish'
      }
    }

    return t(text)
  }, [currentView, isSubmitting, currentModel, itemData, t])

  const handlePublishButtonClick = () => {
    setValue('is_published', itemData ? !itemData.is_published : false)
  }

  const handleSaveButtonClick = () => {
    if (currentView === 'create') {
      setValue('is_published', true)
    }
  }

  return (
    <aside className={clsx(classes.aside, 'sticky top-0 pr-5')}>
      <AsideItemWrap className="!pt-0" title="Publish">
        {currentView === 'update' && (
          <div
            className={clsx(
              'w-full bg-white',
              (itemData?.updated_at || itemData?.created_at) && 'px-4 py-5'
            )}
          >
            {currentModel?.hasTimestamps && (
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {!!itemData?.updated_at && (
                  <li>
                    {t('Updated at:')}{' '}
                    {itemIsLoading ? (
                      <TextSkeleton className="w-full max-w-[6rem]" />
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {dayjs(itemData?.updated_at).format(dateFormat)}
                      </span>
                    )}
                  </li>
                )}
                {!!itemData?.created_at && (
                  <li>
                    {t('Created at:')}{' '}
                    {itemIsLoading ? (
                      <TextSkeleton className="w-full max-w-[6rem]" />
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {dayjs(itemData?.created_at).format(dateFormat)}
                      </span>
                    )}
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        <Group
          sx={(theme) => ({ borderTop: `2px solid ${theme.colors.gray[2]}` })}
          position="apart"
          className="items-center gap-5 px-4 py-4"
        >
          {currentView === 'update' ? (
            <ActionIcon
              size="lg"
              type="button"
              loading={isSubmitting}
              onClick={onItemDeleteRequest}
              color="red"
              variant="light"
              className={clsx(
                isSubmitting && '!cursor-progress',
                'text-sm text-red-500'
              )}
            >
              <iconSet.Trash className="aspect-square w-5" />
            </ActionIcon>
          ) : (
            <span></span>
          )}
          {currentModel?.isDraftable && (
            <Button
              size="sm"
              variant="white"
              type="submit"
              disabled={isSubmitting}
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
            loading={isSubmitting}
            onClick={handleSaveButtonClick}
          >
            {saveButtonText}
          </Button>
        </Group>
      </AsideItemWrap>
      {currentModel?.admin?.layout === 'post-like' &&
        groupedFields &&
        groupedFields.length && (
          <AsideItemWrap title="Other info" className="mt-10">
            <div className="grid gap-5 p-4">
              <FieldMapper fields={groupedFields} />
            </div>
          </AsideItemWrap>
        )}
    </aside>
  )
}
