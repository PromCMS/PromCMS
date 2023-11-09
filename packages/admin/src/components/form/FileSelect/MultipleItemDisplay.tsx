import { MESSAGES } from '@constants';
import { useFileList } from '@hooks/useFileList';
import { Table } from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const MultipleItemDisplay: FC<{ pickedFiles: ItemID[] }> = ({
  pickedFiles,
}) => {
  const { t } = useTranslation();
  const { data } = useFileList(
    {
      limit: 999,
      where: {
        id: { value: pickedFiles, manipulator: 'IN' },
      },
    },
    {
      enabled: Boolean(pickedFiles.length),
    }
  );

  const ths = (
    <tr>
      <th>{t(MESSAGES.NAME)}</th>
      <th>
        <span className="sr-only">Actions</span>
      </th>
    </tr>
  );

  const rows = pickedFiles.length ? (
    data?.data ? (
      data?.data.map((element) => (
        <tr key={element.filename}>
          <td>
            {element.filepath.split('/').slice(0, -1).join('/')}/
            {element.filename}
          </td>
          <td></td>
        </tr>
      ))
    ) : (
      <>
        <tr>
          <td>{t(MESSAGES.PLEASE_WAIT)}</td>
          <td></td>
        </tr>
      </>
    )
  ) : (
    <tr>
      <td>{t(MESSAGES.NO_SELECTED_FILES)}</td>
      <td></td>
    </tr>
  );

  return (
    <Table verticalSpacing="xs">
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
