import { Button } from '@components/Button';
import Popover from '@components/Popover';
import PopoverList from '@components/PopoverList';
import { forwardRef, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'tabler-icons-react';
import { useFileListContext } from '../context';

const GreenButton = forwardRef<HTMLButtonElement, {}>(function GreenButton(
  { children, ...rest },
  ref
) {
  return (
    <Button ref={ref} color="success" {...rest}>
      {children}
    </Button>
  );
});

export const Buttons: VFC = () => {
  const { updateValue, openFilePicker } = useFileListContext();
  const { t } = useTranslation();

  return (
    <div className="ml-3 grid aspect-square h-full flex-none">
      <Popover
        buttonComponent={GreenButton}
        buttonClassName="h-full aspect-square flex"
        offset={[0, 10]}
        placement="bottom-end"
        buttonContent={<Plus size={32} className="absolute left-3 top-3" />}
      >
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
      </Popover>
    </div>
  );
};
