import { ActionIcon, Button, Menu, Popover } from '@mantine/core';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, FolderPlus } from 'tabler-icons-react';

import { useFileListContext } from '../context';

export const Buttons: FC = () => {
  const { updateValue, openFilePicker } = useFileListContext();
  const { t } = useTranslation();

  return (
    <div className="ml-3 h-full flex-none">
      <div className="flex">
        <Button size="sm" className="rounded-r-none" onClick={openFilePicker}>
          {t('Add new file')}
        </Button>

        <Menu withArrow arrowPosition="center" position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="outline"
              className="rounded-l-none flex-none h-full py-1.5 px-1 w-auto"
              size="md"
            >
              <ChevronDown size={22} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="blue"
              leftSection={<FolderPlus className="w-4" />}
              onClick={() => updateValue('showNewFolderCreator', true)}
              title="Add new folder to current folder"
            >
              {t('Add new folder')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};
