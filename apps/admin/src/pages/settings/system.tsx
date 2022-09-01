import { apiClient } from '@api';
import BackendImage from '@components/BackendImage';
import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { Page } from '@custom-types';
import { useCurrentUser } from '@hooks/useCurrentUser';
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
  Paper,
  Textarea,
} from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import clsx from 'clsx';
import { Fragment } from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Plus, Trash } from 'tabler-icons-react';
import { Drawer, CopyName } from '../../components/pages/Settings/MainPage';

const useStyles = createStyles(() => ({
  root: {
    td: {
      verticalAlign: 'baseline',
    },
  },
}));

const smallColSize = 2;
const maxCols = 12;
const colDivider = (
  <Grid.Col span={maxCols}>
    <Divider />
  </Grid.Col>
);

const UserProfileMainPage: Page = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data,
    refetch: mutate,
    isLoading,
    isRefetching,
    isError,
  } = useModelItems('settings', {
    params: { page: currentPage },
  });
  const [optionToEdit, setOptionToEdit] = useState<ItemID | undefined>();
  const [creationAction, setCreationMode] = useState(false);
  const reqNotification = useRequestWithNotifications();
  const largeColSize = currentUser?.isAdmin ? 6 : 8;

  const currentUserCanCreate = currentUser?.can({
    action: 'create',
    targetModel: 'settings',
  });
  const currentUserCanEdit = currentUser?.can({
    action: 'update',
    targetModel: 'settings',
  });
  const currentUserCanDelete = currentUser?.can({
    action: 'delete',
    targetModel: 'settings',
  });

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
            message: t('Deleting selected option, please wait...'),
            successMessage: t('Option deleted!'),
          },
          async () => {
            await apiClient.settings.delete(id);
            await mutate();
          }
        );
      } catch {}
    },
    [t, reqNotification, mutate]
  );

  return (
    <>
      {currentUserCanCreate && (
        <Button
          color={'green'}
          mt="lg"
          leftIcon={<Plus />}
          onClick={() => setCreationMode(true)}
        >
          {t('Add new')}
        </Button>
      )}
      <div className="relative min-h-[400px]">
        <LoadingOverlay
          visible={isLoading || isRefetching || isError}
          overlayBlur={2}
        />
        <Grid
          sx={{ minWidth: 800 }}
          className={clsx(classes.root, 'mt-5')}
          columns={maxCols}
        >
          {currentUserCanCreate && (
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
                {currentUserCanCreate && (
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
                  ) : row.content?.type === 'image' ? (
                    <BackendImage
                      className="h-20 w-auto"
                      imageId={row.content?.data}
                    />
                  ) : (
                    'none'
                  )}
                </Grid.Col>
                <Grid.Col span={smallColSize}>
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
      </div>
      <Drawer
        opened={creationAction || !!optionToEdit}
        optionToEdit={optionToEdit}
        onClose={onModalClose}
      />
    </>
  );
};

export default UserProfileMainPage;
