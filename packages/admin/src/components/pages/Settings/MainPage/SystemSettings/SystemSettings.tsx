import ItemsMissingMessage from '@components/ItemsMissingMessage'
import { useGlobalContext } from '@contexts/GlobalContext'
import { useModelItems } from '@hooks/useModelItems'
import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Textarea,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { iconSet } from '@prom-cms/icons'
import { ItemID } from '@prom-cms/shared'
import { SettingsService } from '@services'
import { useCallback, useMemo, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { Drawer } from './Drawer'

const useStyles = createStyles((theme) => ({
  root: {
    td: {
      verticalAlign: 'baseline',
    },
  },
}))

export const SystemSettings: VFC = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const { currentUserIsAdmin } = useGlobalContext()
  const [currentPage, setCurrentPage] = useState(1)
  const { data, mutate } = useModelItems('settings', { page: currentPage })
  const [optionToEdit, setOptionToEdit] = useState<ItemID | undefined>()
  const [creationAction, setCreationMode] = useState(false)
  const notifications = useNotifications()

  const onModalClose = () => {
    mutate()
    setOptionToEdit(undefined)
    setCreationMode(false)
  }

  const onEditClick = useCallback(
    (nextOption: ItemID | undefined) => () => {
      setOptionToEdit(nextOption)
    },
    []
  )

  const onDeleteClick = useCallback(
    (id: ItemID) => async () => {
      const notifiactionId = notifications.showNotification({
        id: 'on-delete-option',
        loading: true,
        title: 'Deleting',
        message: t('Deleting selected option, please wait...'),
        autoClose: false,
        disallowClose: true,
      })

      try {
        await SettingsService.delete(id)
        await mutate()
        notifications.updateNotification(notifiactionId, {
          message: t('Option deleted!'),
          autoClose: 2000,
        })
      } catch (e) {
        notifications.updateNotification(notifiactionId, {
          color: 'red',
          message: t('An error happened'),
          autoClose: 2000,
        })
      }
    },
    [t, notifications, mutate]
  )

  const rows = useMemo(
    () =>
      data?.data &&
      data.data.map((row) => {
        return (
          <tr key={row.id}>
            {currentUserIsAdmin && <td style={{ maxWidth: 50 }}>{row.name}</td>}
            <td>{row.label}</td>
            <td>
              {row.content?.type === 'textArea' ? (
                <Textarea autosize disabled value={row.content.data} />
              ) : row.content?.type === 'list' ? (
                <ul>
                  {Object.values<{ id: string; value: string }>(
                    row.content?.data || {}
                  ).map(({ id, value }) => (
                    <li key={id} dangerouslySetInnerHTML={{ __html: value }} />
                  ))}
                </ul>
              ) : (
                'none'
              )}
            </td>
            <td style={{ maxWidth: 5 }}>
              <Group className="ml-auto" position="right" spacing="xs" noWrap>
                <ActionIcon onClick={onEditClick(row.id)} color="blue">
                  <iconSet.Edit />
                </ActionIcon>
                {currentUserIsAdmin && (
                  <ActionIcon onClick={onDeleteClick(row.id)} color="red">
                    <iconSet.Trash />
                  </ActionIcon>
                )}
              </Group>
            </td>
          </tr>
        )
      }),
    [data?.data, currentUserIsAdmin, onEditClick, onDeleteClick]
  )

  return (
    <>
      {currentUserIsAdmin && (
        <Button color={'green'} mt="lg" onClick={() => setCreationMode(true)}>
          {t('Add new')}
        </Button>
      )}
      <ScrollArea className="mt-5 min-h-[400px]">
        <Table
          sx={{ minWidth: 800 }}
          verticalSpacing="xs"
          className={classes.root}
        >
          <thead>
            <tr>
              {currentUserIsAdmin && (
                <th style={{ maxWidth: 50 }}>{t('Slug')}</th>
              )}
              <th>{t('Title')}</th>
              <th>{t('Value')}</th>
              <th style={{ maxWidth: 5 }}>
                <span className="hidden">{t('Tools')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows?.length ? (
              rows
            ) : (
              <tr>
                <td colSpan={currentUserIsAdmin ? 4 : 3}>
                  {' '}
                  <ItemsMissingMessage />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      {data && (
        <Group position="center" my="xl">
          <Pagination
            className="my-auto"
            page={currentPage}
            onChange={setCurrentPage}
            total={data!.last_page}
          />
        </Group>
      )}
      <Drawer
        opened={creationAction || !!optionToEdit}
        optionToEdit={optionToEdit}
        onClose={onModalClose}
      />
    </>
  )
}
