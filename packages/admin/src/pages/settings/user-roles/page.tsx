import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { BASE_PROM_ENTITY_TABLE_NAMES } from '@constants';
import { Page } from '@custom-types';
import { LoadingOverlay, Table, createStyles } from '@mantine/core';
import clsx from 'clsx';
import { useModelItems } from 'hooks/useModelItems';
import { useTranslation } from 'react-i18next';

const useStyles = createStyles(() => ({
  root: {
    td: {
      verticalAlign: 'baseline',
    },
  },
}));

const UserRolesPage: Page = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const { data, isLoading, isError, isRefetching } = useModelItems(
    BASE_PROM_ENTITY_TABLE_NAMES.USER_ROLES
  );

  const ths = (
    <tr>
      <th>{t('Title')}</th>
      <th>{t('Description')}</th>
      <th className="w-[100px] opacity-0">Tools</th>
    </tr>
  );

  const rows = data?.data ? (
    data.data.map((row, index) => (
      <tr key={row.id}>
        <td>{row.label}</td>
        <td>{row.description}</td>
        <td></td>
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
      <div className="relative min-h-[400px]">
        <LoadingOverlay
          visible={isLoading || isRefetching || isError}
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
      </div>
    </>
  );
};

export default UserRolesPage;
