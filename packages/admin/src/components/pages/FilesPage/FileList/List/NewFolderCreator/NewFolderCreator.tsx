import { getUseFoldersRoute } from '@hooks/useFolders'
import axios from 'axios'
import clsx from 'clsx'
import { FolderService } from '@services'
import { useEffect, VFC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSWRConfig } from 'swr'
import { useFileListContext } from '../../context'
import { useClassNames } from '../../useClassNames'
import { iconSet } from '@prom-cms/icons'

export const NewFolderCreator: VFC<{ styles: any }> = ({ styles = {} }) => {
  const { updateValue, currentPath } = useFileListContext()
  const { mutate } = useSWRConfig()
  const classNames = useClassNames()
  const { t } = useTranslation()
  const { register, handleSubmit, setFocus, formState, setError } = useForm<{
    name: string
  }>()

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  const onSubmit = async ({ name }) => {
    try {
      await FolderService.create(`${currentPath}/${name}`)
      await mutate(getUseFoldersRoute(currentPath))
      updateValue('showNewFolderCreator', false)
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        setError('name', { message: 'This folder already exists' })
        return false
      }
      throw e
    }
  }

  const onBlur = () => {
    if (!formState.isSubmitting) {
      updateValue('showNewFolderCreator', false)
    }
  }

  return (
    <div
      className={clsx(
        classNames.itemRoot,
        'text-left',
        formState.isSubmitting && 'cursor-wait'
      )}
      style={styles}
    >
      <div className={clsx(classNames.itemSquare(false), 'flex')}>
        <iconSet.FolderPlus className="m-auto h-28 w-28 text-blue-500" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <input
          className="mt-1 w-full !border-b-4 !border-blue-500 bg-transparent text-lg font-medium outline-0 disabled:opacity-50"
          disabled={formState.isSubmitting || formState.isSubmitSuccessful}
          autoComplete="off"
          {...register('name', { onBlur })}
        />
        {formState.errors?.['name']?.message && (
          <small className="b-0 translate-y-full text-lg font-semibold text-red-500">
            {t(formState.errors['name'].message)}
          </small>
        )}
      </form>
    </div>
  )
}
