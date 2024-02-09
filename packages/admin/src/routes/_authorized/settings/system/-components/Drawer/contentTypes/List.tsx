import {
  ActionIcon,
  Input,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { VFC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Plus, Trash } from 'tabler-icons-react';

interface DndListHandleProps {
  data: {
    id: string;
    value: string;
  }[];
}

export const List: VFC = () => {
  const { register } = useFormContext();
  const { append, remove, fields, move } = useFieldArray<{
    content: { data: DndListHandleProps['data'] };
  }>({
    name: 'content.data',
    shouldUnregister: true,
  });
  const [stringValue, setStringValue] = useInputState('');
  const { t } = useTranslation();

  const onDeleteClick = (id: number) => () => {
    remove(id);
  };

  const onAdd = () => {
    if (!stringValue) {
      return;
    }

    // Generate unique id
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    append({
      id,
      value: stringValue,
    });
    setStringValue('');
  };

  const onChangePlace = (direction: 'up' | 'down', id: string) => () => {
    const index = fields.findIndex(({ id: key }) => key === id);

    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    move(index, nextIndex);
  };

  return (
    <>
      <Paper shadow="xs" p="md" withBorder>
        <TextInput
          value={stringValue}
          label={t('Add new entry')}
          placeholder={t('Some text')}
          icon={<Plus size={20} />}
          onChange={setStringValue}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              e.preventDefault();
              e.stopPropagation();
              onAdd();
            }
          }}
        />
        <Input.Wrapper label={t('Items')} mt="lg">
          <SimpleGrid cols={1}>
            {!!fields && Array.isArray(fields) && fields.length ? (
              fields.map((item, index) => (
                <div key={item.id} className={'flex items-center'}>
                  <div className="mr-1 flex">
                    <ActionIcon
                      disabled={index === 0}
                      onClick={onChangePlace('up', item.id)}
                    >
                      <ChevronUp size={18} />
                    </ActionIcon>
                    <ActionIcon
                      disabled={(fields || []).length - 1 === index}
                      onClick={onChangePlace('down', item.id)}
                    >
                      <ChevronDown size={18} />
                    </ActionIcon>
                  </div>
                  <TextInput
                    className="w-full"
                    {...register(`content.data.${index}.value`)}
                  />
                  <ActionIcon
                    ml="md"
                    color="red"
                    onClick={onDeleteClick(index)}
                  >
                    <Trash />
                  </ActionIcon>
                </div>
              ))
            ) : (
              <Text color="dimmed">{t('No items yet...')}</Text>
            )}
          </SimpleGrid>
        </Input.Wrapper>
      </Paper>
    </>
  );
};
