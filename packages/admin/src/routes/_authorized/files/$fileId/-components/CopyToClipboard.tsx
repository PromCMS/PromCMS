import { MESSAGES } from '@constants';
import { ActionIcon, TextInput, Tooltip } from '@mantine/core';
import { useClipboard, useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck } from 'tabler-icons-react';

export const CopyToClipboard: FC<{ fileUrl: URL }> = ({ fileUrl }) => {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  const clipboard = useClipboard();
  const { t } = useTranslation();

  const onCopyClick = () => clipboard.copy(fileUrl);

  return (
    <TextInput
      key="fileUrl"
      label={t(MESSAGES.FILE_URL)}
      type="string"
      className="w-full"
      autoComplete="off"
      value={fileUrl.toString()}
      rightSection={
        <Tooltip
          label={t(
            clipboard.copied ? MESSAGES.COPY_DONE : MESSAGES.COPY_TO_CLIPBOARD
          )}
          position="top"
          radius="xl"
          transitionProps={{ transition: 'fade', duration: 200 }}
          opened={hovered || clipboard.copied}
        >
          <ActionIcon
            ref={ref}
            onClick={onCopyClick}
            color="blue"
            variant="filled"
            className="mr-2"
          >
            <ClipboardCheck className="h-5 w-5" />
          </ActionIcon>
        </Tooltip>
      }
      disabled
    />
  );
};
