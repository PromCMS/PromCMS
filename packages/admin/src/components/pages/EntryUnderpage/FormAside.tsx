import AsideItemWrap from '@components/AsideItemWrap'
import { Button } from '@components/Button'
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper'
import Skeleton, { SkeltonProps } from '@components/Skeleton'
import { TrashIcon } from '@heroicons/react/outline'
import { RefreshIcon } from '@heroicons/react/solid'
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
  const { watch } = useFormContext()
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

  // TODO: Delete action

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

        <div className="flex items-center justify-between gap-5 border-t-2 border-project-border px-4 py-4">
          {currentView === 'update' ? (
            <Button
              size="large"
              type="button"
              disabled={isSubmitting}
              onClick={onItemDeleteRequest}
              className={clsx(
                isSubmitting && '!cursor-progress',
                '!pl-0 text-sm text-red-500'
              )}
            >
              <TrashIcon className="mr-3 -mt-1 inline w-5" />
              {t('Delete')}
            </Button>
          ) : (
            <span></span>
          )}
          <div className="flex flex-row items-center justify-end gap-5">
            {isSubmitting && (
              <p className="animate-pulse text-lg font-semibold text-orange-500">
                <RefreshIcon className="mr-1.5 inline w-5 animate-spin" />
                {t('Saving...')}
              </p>
            )}
            <Button
              size="large"
              color="success"
              type="submit"
              disabled={isSubmitting || !isEdited}
              className={clsx(isSubmitting && '!cursor-progress')}
            >
              {t('Uložit')}
            </Button>
          </div>
        </div>
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
