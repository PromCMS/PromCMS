import ThemeProvider from '@components/ThemeProvider';
import { ActionIcon, Badge, Group, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import clsx from 'clsx';
import { KeyboardEventHandler, useEffect, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, X } from 'tabler-icons-react';
import { TagsToolData } from './TagsTool';

export const TagsToolView: VFC<{
  dataFromParent: TagsToolData;
  onDataChange: (data: TagsToolData) => void;
  readOnly: boolean;
}> = ({ readOnly, dataFromParent, onDataChange }) => {
  const [data, setData] = useState<TagsToolData>(dataFromParent);
  const [inputValue, setInputValue] = useInputState('');
  const { t } = useTranslation();

  useEffect(() => {
    setData(dataFromParent);
  }, [dataFromParent]);

  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  const onRemoveClick = (tagContent) => () =>
    setData({
      ...data,
      tags: data.tags.filter((tagValue) => tagValue !== tagContent),
    });

  const onAddClick = () => {
    if (!inputValue) {
      return;
    }

    setData({
      ...data,
      tags: [
        ...data.tags.filter((tagValue) => tagValue !== inputValue),
        inputValue,
      ],
    });
    setInputValue('');
  };

  const onKeyDownInput: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      e.preventDefault();
      e.stopPropagation();
      onAddClick();
    }
  };

  return (
    <ThemeProvider>
      <div
        className={clsx(
          'rounded-lg border-2 border-project-border bg-white p-5'
        )}
      >
        <p className="text-xl font-semibold">{t('Tags')}</p>
        <Group className="my-5">
          {data.tags.length ? (
            data.tags.map((tagContent) => (
              <Badge
                variant="outline"
                size="xl"
                rightSection={
                  !readOnly && (
                    <ActionIcon
                      size="xs"
                      color="gray"
                      radius="xl"
                      variant="light"
                      onClick={onRemoveClick(tagContent)}
                    >
                      <X size={10} />
                    </ActionIcon>
                  )
                }
                key={tagContent}
              >
                {tagContent}
              </Badge>
            ))
          ) : (
            <p className="text-gray-400">
              {t('No tags, start by adding some')}
            </p>
          )}
        </Group>
        {!readOnly && (
          <Group noWrap>
            <TextInput
              icon={<Tag size={20} />}
              placeholder={t('New badge name')}
              className="w-full"
              value={inputValue}
              onInput={setInputValue}
              onKeyDown={onKeyDownInput}
            />
          </Group>
        )}
      </div>
    </ThemeProvider>
  );
};
