import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { useGlobalContext } from '@contexts/GlobalContext';
import { Page } from '@custom-types';
import { useModelItems } from '@hooks/useModelItems';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import {
  ActionIcon,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Pagination,
  Table,
} from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import { UserRolesService } from '@services';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Plus, Trash } from 'tabler-icons-react';
import { Drawer } from '../../components/pages/Settings/UserRoles';

const useStyles = createStyles(() => ({
  root: {
    td: {
      verticalAlign: 'baseline',
    },
  },
}));

const smallColSize = 2;
const maxCols = 12;
const largeColSize = 8;
const colDivider = (
  <Grid.Col span={maxCols}>
    <Divider />
  </Grid.Col>
);

const UserRolesPage: Page = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const { currentUserIsAdmin } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, mutate, isLoading, isError, isValidating } = useModelItems(
    'userRoles',
    { page: currentPage }
  );
  const [optionToEdit, setOptionToEdit] = useState<ItemID | undefined>();
  const [creationAction, setCreationMode] = useState(false);
  const reqNotification = useRequestWithNotifications();

  const currentUserCanEdit = currentUserIsAdmin;
  const currentUserCanDelete = currentUserIsAdmin;

  const onModalClose = () => {
    mutate();
    setOptionToEdit(undefined);
    setCreationMode(false);
  };

  const onEditClick = useCallback(
    (nextOption: ItemID | undefined) => () => {
      setOptionToEdit(nextOption);
    },
    []
  );

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
            await UserRolesService.delete(id);
            await mutate();
          }
        );
      } catch {}
    },
    [t, reqNotification, mutate]
  );

  const ths = (
    <tr>
      <th>{t('Title')}</th>
      <th className="w-full max-w-[350px]">{t('Description')}</th>
      <th className="w-[100px] opacity-0">Tools</th>
    </tr>
  );

  const rows = data?.data ? (
    data.data.map((row, index) => (
      <tr key={row.id}>
        <td>{row.label}</td>
        <td className="w-full max-w-[350px]">{row.description}</td>
        <td>
          {row.id !== 0 && (
            <Group className="ml-auto" position="right" spacing="xs" noWrap>
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
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={3} rowSpan={5}>
        <ItemsMissingMessage />
      </td>
    </tr>
  );

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
      <div className="relative min-h-[400px]">
        <LoadingOverlay
          visible={isLoading || isValidating || isError}
          overlayBlur={2}
        />
        <Table
          className={clsx(classes.root, '-mx-5 mt-5')}
          horizontalSpacing="xl"
          verticalSpacing="sm"
        >
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
          <tfoot>{ths}</tfoot>
        </Table>
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
      </div>
      <Drawer
        opened={creationAction || !!optionToEdit}
        optionToEdit={optionToEdit}
        onClose={onModalClose}
      />
    </>
  );
};

export default UserRolesPage;
