import useCurrentModel from '@hooks/useCurrentModel'
import EditorJS from '@editorjs/editorjs'
import { useNotifications } from '@mantine/notifications'
import { ApiResultItem } from '@prom-cms/shared'
import { EntryService } from '@services'
import { getObjectDiff } from '@utils'
import { useRouter } from 'next/router'
import { RefObject, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useEntryUnderpageContext } from './context'
import { useSWRConfig } from 'swr'

export const useOnSubmit = (): [
  (values: any) => Promise<void>,
  RefObject<EditorJS>
] => {
  const editorRef = useRef<EditorJS>(null)
  const { mutate } = useSWRConfig()
  const { currentView, itemData } = useEntryUnderpageContext()
  const { t } = useTranslation()
  const model = useCurrentModel()
  const { push } = useRouter()
  const notifications = useNotifications()

  const onSubmit = async (values) => {
    const modelName = (model as NonNullable<typeof model>).name
    const id = notifications.showNotification({
      id: currentView === 'update' ? 'on-update-entry' : 'on-create-entry',
      loading: true,
      title: currentView === 'update' ? 'Updating' : 'Creating',
      message: t(
        currentView === 'update'
          ? 'Updating your entry, please wait...'
          : 'Creating new entry, please wait...'
      ),
      autoClose: false,
      disallowClose: true,
    })

    if (editorRef.current && (await editorRef.current.isReady)) {
      values.content = await editorRef.current.saver.save()
    }

    if (currentView === 'update') {
      try {
        const finalValues = getObjectDiff(itemData, values) as ApiResultItem
        const itemId = (itemData as NonNullable<typeof itemData>).id

        await EntryService.update(
          {
            id: itemId,
            model: modelName,
          },
          finalValues
        )

        await mutate(EntryService.apiGetUrl(itemId, modelName), (prevData) => ({
          ...prevData,
          finalValues,
        }))

        notifications.updateNotification(id, {
          message: t('Your entry is updated!'),
          autoClose: 2000,
        })
      } catch {
        notifications.updateNotification(id, {
          color: 'red',
          message: t('An error happened'),
          autoClose: 2000,
        })
      }
    } else if (currentView === 'create') {
      try {
        const result = await EntryService.create(
          {
            model: modelName,
          },
          values
        )

        if (!result?.data) {
          throw new Error('No data has been received')
        }

        push(EntryService.getListUrl(model?.name as string))

        notifications.updateNotification(id, {
          message: t('New entry has been created!'),
          autoClose: 2000,
        })
      } catch {
        notifications.updateNotification(id, {
          color: 'red',
          message: t('An error happened'),
          autoClose: 2000,
        })
      }
    }
  }

  return [onSubmit, editorRef]
}
