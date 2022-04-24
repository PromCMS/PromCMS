import { ActionIcon, Button, UnstyledButton } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { useEffect, useRef, useState, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEntryUnderpageContext } from '..'
import { useOnSubmit } from '../useOnSubmit'

export const EditableTitle: VFC = () => {
  const [editModeSubmitting, setEditModeSubmitting] = useState(false)
  const [onSubmitCallback] = useOnSubmit()
  const { currentView } = useEntryUnderpageContext()
  const [editingMode, setEditingMode] = useState(currentView === 'create')
  const { register, watch, formState } = useFormContext()
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

  return (
    <div className="flex w-full items-center">
      <div className="relative w-full">
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
        {formState.errors?.['title']?.message && (
          <small className="font-bold text-red-500">
            {formState.errors['title'].message}
          </small>
        )}
      </div>
      {currentView === 'update' &&
        (editingMode ? (
          <ActionIcon
            type="button"
            variant="light"
            className="ml-5 bg-white text-green-500 hover:scale-110"
            title={t('Save changes')}
            size={50}
            loading={editModeSubmitting}
            onClick={onEditEndClick}
          >
            <iconSet.Check size={40} className="h-10 w-10" />
          </ActionIcon>
        ) : (
          <ActionIcon
            type="button"
            variant="light"
            className="ml-5 text-gray-300 hover:scale-110"
            title={t('Edit title')}
            size={50}
            onClick={onEditClick}
          >
            <iconSet.Pencil size={40} className="h-10 w-10" />
          </ActionIcon>
        ))}
    </div>
  )
}
