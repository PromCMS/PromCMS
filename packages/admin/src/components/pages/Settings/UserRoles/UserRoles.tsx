import ItemsMissingMessage from '@components/ItemsMissingMessage'
import { useGlobalContext } from '@contexts/GlobalContext'
import { useModelItems } from '@hooks/useModelItems'
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications'
import {
  ActionIcon,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  Pagination,
} from '@mantine/core'
import { ItemID } from '@prom-cms/shared'
import { UserRolesService } from '@services'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useCallback, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit, Plus, Trash } from "tabler-icons-react"
import { Drawer } from './Drawer'

const useStyles = createStyles(() => ({
  root: {
    td: {
      verticalAlign: 'baseline',
    },
  },
}))

const smallColSize = 2
const maxCols = 12
const largeColSize = 8
const colDivider = (
  <Grid.Col span={maxCols}>
    <Divider />
  </Grid.Col>
)

export const UserRoles: VFC = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const { currentUserIsAdmin } = useGlobalContext()
  const [currentPage, setCurrentPage] = useState(1)
  const { data, mutate } = useModelItems('userroles', { page: currentPage })
  const [optionToEdit, setOptionToEdit] = useState<ItemID | undefined>()
  const [creationAction, setCreationMode] = useState(false)
  const reqNotification = useRequestWithNotifications()

  const currentUserCanEdit = currentUserIsAdmin
  const currentUserCanDelete = currentUserIsAdmin

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
      try {
        reqNotification(
          {
            title: 'Deleting',
            message: t('Deleting selected user role, please wait...'),
            successMessage: t('User role deleted!'),
          },
          async () => {
            await UserRolesService.delete(id)
            await mutate()
          }
        )
      } catch {}
    },
    [t, reqNotification, mutate]
  )

  return (
    <>
      <div>
        {currentUserIsAdmin && (
          <Button
            color="green"
            mt="lg"
            leftIcon={<Plus />}
            onClick={() => setCreationMode(true)}
          >
            {t('Add new')}
          </Button>
        )}
      </div>
      <Grid
        sx={{ minWidth: 800 }}
        className={clsx(classes.root, 'mt-5 min-h-[400px]')}
        columns={maxCols}
      >
        <Grid.Col span={smallColSize} className="font-semibold uppercase">
          {t('Title')}
        </Grid.Col>
        <Grid.Col span={largeColSize} className="font-semibold uppercase">
          {t('Description')}
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
              <Grid.Col span={smallColSize}>{row.label}</Grid.Col>
              <Grid.Col span={largeColSize}>{row.description}</Grid.Col>
              <Grid.Col span={smallColSize}>
                {row.id !== 0 && (
                  <Group
                    className="ml-auto"
                    position="right"
                    spacing="xs"
                    noWrap
                  >
                    {currentUserCanEdit && (
                      <ActionIcon onClick={onEditClick(row.id)} color="blue">
                        <Edit />
                      </ActionIcon>
                    )}
                    {currentUserCanDelete && (
                      <ActionIcon onClick={onDeleteClick(row.id)} color="red">
                        <Trash />
                      </ActionIcon>
                    )}
                  </Group>
                )}
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
