import { Repeater } from '@components/FieldMapper/fields/json/Repeater';
import { MESSAGES } from '@constants';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldPlacements, RepeaterAdminSchema } from '@prom-cms/schema';

const repeaterFields: RepeaterAdminSchema['columns'] = [
  {
    type: 'string',
    hide: false,
    name: 'value',
    primaryString: false,
    readonly: false,
    required: true,
  },
];

export const List: FC = () => {
  const { t } = useTranslation();
  return (
    <Repeater
      name="content"
      label={t(MESSAGES.VALUE)}
      placement={FieldPlacements.MAIN}
      columns={repeaterFields}
    />
  );

  // return (
  //   <>
  //     <Paper shadow="xs" p="md" withBorder>
  //       <TextInput
  //         value={stringValue}
  //         label={t('Add new entry')}
  //         placeholder={t('Some text')}
  //         leftSection={<Plus size={20} />}
  //         onChange={setStringValue}
  //         onKeyDown={(e) => {
  //           if (e.key.toLowerCase() === 'enter') {
  //             e.preventDefault();
  //             e.stopPropagation();
  //             onAdd();
  //           }
  //         }}
  //       />
  //       <Input.Wrapper label={t('Items')} mt="lg">
  //         <SimpleGrid cols={1}>
  //           {!!fields && Array.isArray(fields) && fields.length ? (
  //             fields.map((item, index) => (
  //               <div key={item.id} className={'flex items-center'}>
  //                 <div className="mr-1 flex">
  //                   <ActionIcon
  //                     disabled={index === 0}
  //                     onClick={onChangePlace('up', item.id)}
  //                   >
  //                     <ChevronUp size={18} />
  //                   </ActionIcon>
  //                   <ActionIcon
  //                     disabled={(fields || []).length - 1 === index}
  //                     onClick={onChangePlace('down', item.id)}
  //                   >
  //                     <ChevronDown size={18} />
  //                   </ActionIcon>
  //                 </div>
  //                 <TextInput
  //                   className="w-full"
  //                   {...register(`content.data.${index}.value`)}
  //                 />
  //                 <ActionIcon
  //                   ml="md"
  //                   color="red"
  //                   onClick={onDeleteClick(index)}
  //                 >
  //                   <Trash />
  //                 </ActionIcon>
  //               </div>
  //             ))
  //           ) : (
  //             <Text color="dimmed">{t('No items yet...')}</Text>
  //           )}
  //         </SimpleGrid>
  //       </Input.Wrapper>
  //     </Paper>
  //   </>
  // );
};
