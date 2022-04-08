import { CheckIcon, PencilIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { useEffect, useRef, useState, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEntryUnderpageContext } from '..'
import { useOnSubmitCallback } from '../useOnSubmitCallback'

export const EditableTitle: VFC = () => {
  const [editModeSubmitting, setEditModeSubmitting] = useState(false)
  const onSubmitCallback = useOnSubmitCallback()
  const { currentView } = useEntryUnderpageContext()
  const [editingMode, setEditingMode] = useState(currentView === 'create')
  const { register, watch } = useFormContext()
  const { ref: inputFormRef, ...restInputProps } = register('title')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { t } = useTranslation()

  const titleValue = watch('title')

  const onEditClick = () => setEditingMode(true)
  const onEditEndClick = async () => {
    setEditModeSubmitting(true)
    await onSubmitCallback({ title: titleValue })
    setEditModeSubmitting(false)
    setEditingMode(false)
  }

  useEffect(() => {
    if (editingMode && inputRef.current) {
      inputRef.current?.focus()
    }
  }, [editingMode])

  // TODO: Show error

  return (
    <div className="flex w-full items-center">
      <input
        className={clsx(
          'w-full bg-transparent text-5xl font-bold outline-none',
          !editingMode && 'cursor-default'
        )}
        placeholder={t('Enter your title here...')}
        readOnly={!editingMode}
        ref={(e) => {
          inputFormRef(e)
          inputRef.current = e
        }}
        {...restInputProps}
      />
      {currentView === 'update' &&
        (editingMode ? (
          <button
            type="button"
            className="ml-5 rounded-full bg-white p-1 text-green-500 shadow-md hover:scale-110"
            title={t('Save changes')}
            onClick={onEditEndClick}
          >
            {editModeSubmitting ? (
              <span className="block aspect-square w-8 font-bold">...</span>
            ) : (
              <CheckIcon className="w-8" />
            )}
          </button>
        ) : (
          <button
            type="button"
            className="ml-5 text-gray-300 hover:scale-110"
            title={t('Edit title')}
            onClick={onEditClick}
          >
            <PencilIcon className="w-8" />
          </button>
        ))}
    </div>
  )
}
