import ItemsMissingMessage from '@components/ItemsMissingMessage'
import { useGlobalContext } from '@contexts/GlobalContext'
import { useModelItems } from '@hooks/useModelItems'
import {
  ActionIcon,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  Pagination,
  Paper,
  Textarea,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import { iconSet } from '@prom-cms/icons'
import { ItemID } from '@prom-cms/shared'
import { SettingsService } from '@services'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useCallback, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { Drawer } from './Drawer'
import { CopyName } from './Table'

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

  const smallColSize = 2
  const maxCols = 12
  const largeColSize = currentUserIsAdmin ? 6 : 8
  const colDivider = (
    <Grid.Col span={maxCols}>
      <Divider />
    </Grid.Col>
  )

  return (
    <>
      {currentUserIsAdmin && (
        <Button color={'green'} mt="lg" onClick={() => setCreationMode(true)}>
          {t('Add new')}
        </Button>
      )}
      <Grid
        sx={{ minWidth: 800 }}
        className={clsx(classes.root, 'mt-5 min-h-[400px]')}
        columns={maxCols}
      >
        {currentUserIsAdmin && (
          <Grid.Col span={smallColSize} className="font-semibold uppercase">
            {t('Slug')}
          </Grid.Col>
        )}
        <Grid.Col span={smallColSize} className="font-semibold uppercase">
          {t('Title')}
        </Grid.Col>
        <Grid.Col span={largeColSize} className="font-semibold uppercase">
          {t('Value')}
        </Grid.Col>
        <Grid.Col span={smallColSize}>
          <span className="hidden">{t('Tools')}</span>
        </Grid.Col>
        <Grid.Col span={maxCols}>
          <Divider size="sm" />
        </Grid.Col>
        {data?.data ? (
          data.data.map((row, index) => (
            <Fragment key={row.id}>
              {index !== 0 && colDivider}
              {currentUserIsAdmin && (
                <Grid.Col span={smallColSize}>
                  <Group>
                    <CopyName name={row.name} />
                    {row.name}
                  </Group>
                </Grid.Col>
              )}
              <Grid.Col span={smallColSize}>{row.label}</Grid.Col>
              <Grid.Col span={largeColSize}>
                {row.content?.type === 'textArea' ? (
                  <Textarea autosize readOnly value={row.content.data} />
                ) : row.content?.type === 'list' ? (
                  <Paper
                    sx={(theme) => ({ borderColor: theme.colors.gray[4] })}
                    withBorder
                    p="sm"
                  >
                    <ul className="list-disc pl-5">
                      {row.content?.data.map(({ id, value }) => (
                        <li
                          key={id}
                          dangerouslySetInnerHTML={{ __html: value }}
                        />
                      ))}
                    </ul>
                  </Paper>
                ) : (
                  'none'
                )}
              </Grid.Col>
              <Grid.Col span={smallColSize}>
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
              </Grid.Col>
            </Fragment>
          ))
        ) : (
          <Grid.Col span={12}>
            <ItemsMissingMessage />
          </Grid.Col>
        )}
      </Grid>
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