import { Button } from '@components/Button';
import PopoverList from '@components/PopoverList';
import { Popover } from '@mantine/core';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'tabler-icons-react';
import { useFileListContext } from '../context';

export const Buttons: FC = () => {
  const { updateValue, openFilePicker } = useFileListContext();
  const { t } = useTranslation();

  return (
    <div className="ml-3 grid aspect-square h-full flex-none">
      <Popover offset={10} position="bottom-end">
        <Popover.Target>
          <Button
            color="success"
            className="relative flex aspect-square h-full cursor-pointer"
          >
            <Plus size={32} className="absolute left-3 top-3" />
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <PopoverList>
            <PopoverList.Item
              icon="FilePlus"
              title="Add new file to current folder"
              onClick={openFilePicker}
            >
              {t('Add new file')}
            </PopoverList.Item>
            <PopoverList.Item
              icon="FolderPlus"
              onClick={() => updateValue('showNewFolderCreator', true)}
              title="Add new folder to current folder"
            >
              {t('Add new folder')}
            </PopoverList.Item>
          </PopoverList>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};
