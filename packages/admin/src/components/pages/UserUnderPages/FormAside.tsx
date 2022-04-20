import AsideItemWrap from '@components/AsideItemWrap'
import Skeleton, { SkeltonProps } from '@components/Skeleton'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { MESSAGES } from '@constants'
import { EntryService } from '@services'
import { useMemo, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getObjectDiff } from '@utils'
import { useClassNames } from '../EntryUnderpage/useClassNames'
import { useData } from './context'
import { iconSet } from '@prom-cms/icons'
import { ActionIcon, Button } from '@mantine/core'

const TextSkeleton: VFC<SkeltonProps> = ({ className, ...rest }) => (
  <Skeleton
    className={clsx('relative top-0.5 inline-block h-4', className)}
    {...rest}
  />
)

const dateFormat = 'D.M. YYYY @ HH:mm'

export const FormAside: VFC = () => {
  const { isLoading, view, user, exitView, model } = useData()
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext()
  const formValues = watch()
  const classes = useClassNames()
  const { t } = useTranslation()

  const isEdited = useMemo(
    () =>
      view === 'update'
        ? !!Object.keys(getObjectDiff(user || {}, formValues)).length
        : true,
    [formValues, view, user]
  )

  const onItemDeleteRequest = async () => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      exitView()
      await EntryService.delete({
        id: user?.id as number,
        model: 'users',
      })
    }
  }

  return (
    <aside className={clsx(classes.aside, 'sticky top-0')}>
      <AsideItemWrap className="!pt-0" title="Apply changes">
        {view === 'update' && (
          <div
            className={clsx(
              'w-full bg-white py-5 px-4',
              !user?.updated_at && !user?.created_at && 'hidden'
            )}
          >
            {model?.hasTimestamps && (
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {!!user?.updated_at && (
                  <li>
                    {t('Updated at:')}{' '}
                    {isLoading ? (
                      <TextSkeleton className="w-full max-w-[6rem]" />
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {dayjs(user?.updated_at).format(dateFormat)}
                      </span>
                    )}
                  </li>
                )}
                {!!user?.created_at && (
                  <li>
                    {t('Created at:')}{' '}
                    {isLoading ? (
                      <TextSkeleton className="w-full max-w-[6rem]" />
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {dayjs(user?.created_at).format(dateFormat)}
                      </span>
                    )}
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-5 border-t-2 border-project-border px-4 py-4">
          {view === 'update' ? (
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
          <Button
            size="lg"
            color="green"
            type="submit"
            disabled={isSubmitting || !isEdited}
            loading={isSubmitting}
            className={clsx(isSubmitting && '!cursor-progress')}
          >
            {t(isSubmitting ? 'Saving...' : 'Save')}
          </Button>
        </div>
      </AsideItemWrap>
    </aside>
  )
}
