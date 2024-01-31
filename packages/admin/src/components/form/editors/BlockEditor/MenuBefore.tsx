import { Button, Popover } from '@mantine/core';
import { useCurrentEditor } from '@tiptap/react';
import { FC, useEffect } from 'react';
import { Filter } from 'tabler-icons-react';

export const MenuBefore: FC = () => {
  const { editor } = useCurrentEditor();

  useEffect(() => {
    const listener = editor?.on('focus', () => {});
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="sticky w-0 h-0 opacity-0 group-hover:opacity-100">
      <div className="absolute -left-2 top-0 -translate-x-4">
        <Popover position="right-start">
          <Popover.Target>
            <Button>
              <Filter />
            </Button>
          </Popover.Target>
          <Popover.Dropdown>adfadsfasd</Popover.Dropdown>
        </Popover>
      </div>
    </div>
  );
};
