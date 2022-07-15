import { ActionIcon, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Paperclip } from 'tabler-icons-react';

export const CopyName: VFC<{ name: string }> = ({ name }) => {
  const clipboard = useClipboard();
  const { t } = useTranslation();

  const onCopyClick = () => clipboard.copy(name);

  return (
    <Tooltip
      label={t('Copied!')}
      gutter={5}
      placement="center"
      position="bottom"
      radius="xl"
      transition="slide-down"
      transitionDuration={150}
      opened={clipboard.copied}
    >
      <ActionIcon color="blue" onClick={onCopyClick} size={20}>
        <Paperclip size={20} />
      </ActionIcon>
    </Tooltip>
  );
};
