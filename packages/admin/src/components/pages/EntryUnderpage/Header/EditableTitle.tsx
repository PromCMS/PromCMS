import clsx from 'clsx'
import { VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const EditableTitle: VFC = () => {
  const { register, formState } = useFormContext()
  const { t } = useTranslation()

  return (
    <>
      <div className="relative w-full">
        <input
          className={clsx(
            'w-full !border-b-2 border-project-border bg-transparent pb-5 text-5xl font-bold outline-none duration-200 focus:border-blue-500'
          )}
          placeholder={t('Enter your title here...')}
          {...register('title')}
        />
        {formState.errors?.['title']?.message && (
          <small className="font-bold text-red-500">
            {formState.errors['title'].message}
          </small>
        )}
      </div>
    </>
  )
}
