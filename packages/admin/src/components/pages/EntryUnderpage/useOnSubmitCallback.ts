import useCurrentModel from '@hooks/useCurrentModel'
import { useNotifications } from '@mantine/notifications'
import { ApiResultItem } from '@prom-cms/shared'
import { EntryService } from '@services'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { getObjectDiff } from '@utils'
import { useEntryUnderpageContext } from './context'

export const useOnSubmitCallback = () => {
  const { currentView, itemData } = useEntryUnderpageContext()
  const { t } = useTranslation()
  const model = useCurrentModel()
  const { push } = useRouter()
  const notifications = useNotifications()

  return async (values) => {
    const id = notifications.showNotification({
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

    if (currentView === 'update') {
      const result = await EntryService.update(
        {
          id: (itemData as NonNullable<typeof itemData>).id,
          model: (model as NonNullable<typeof model>).name,
        },
        getObjectDiff(itemData, values) as ApiResultItem
      ).catch(() => {
        notifications.updateNotification(id, {
          message: t('An error happened'),
          autoClose: 2000,
        })
      })

      notifications.updateNotification(id, {
        message: t('Your entry is updated!'),
        autoClose: 2000,
      })
    } else if (currentView === 'create') {
      const result = await EntryService.create(
        {
          model: (model as NonNullable<typeof model>).name,
        },
        getObjectDiff(itemData || {}, values) as ApiResultItem
      ).catch(() => {
        notifications.updateNotification(id, {
          message: t('An error happened'),
          autoClose: 2000,
        })
      })

      if (result?.data) {
        push(EntryService.getListUrl(model?.name as string))

        notifications.updateNotification(id, {
          message: t('New entry has been created!'),
          autoClose: 2000,
        })
      }
    }
  }
}
