import { MESSAGES } from '@constants';
import { TextInput } from '@mantine/core';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FileItem } from '@prom-cms/api-client';

// TODO Finish
// const groceries = [
//   {
//     emoji: '🍎',
//     value: 'Apples',
//     description:
//       'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
//   },
//   {
//     emoji: '🍌',
//     value: 'Bananas',
//     description:
//       'Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking.',
//   },
//   {
//     emoji: '🥦',
//     value: 'Broccoli',
//     description:
//       'Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries.',
//   },
// ];

export const FileSystemPath: FC<{ file: FileItem }> = ({ file }) => {
  // const { hovered, ref } = useHover<HTMLButtonElement>();
  const { t } = useTranslation();
  // const subItems = groceries.map((item) => (
  //   <Accordion.Item key={item.value} value={item.value}>
  //     <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
  //     <Accordion.Panel>{item.description}</Accordion.Panel>
  //   </Accordion.Item>
  // ));

  // See groceries data above
  // const items = groceries.map((item) => (
  //   <Accordion.Item key={item.value} value={item.value}>
  //     <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
  //     <Accordion.Panel>
  //       {item.description}
  //       <Accordion defaultValue="Apples">{subItems}</Accordion>
  //     </Accordion.Panel>
  //   </Accordion.Item>
  // ));

  return (
    <TextInput
      key="fileUrl"
      label={t(MESSAGES.FILEPATH)}
      type="string"
      className="w-full"
      autoComplete="off"
      value={'/' + file.filepath.split('/').slice(1, -1).join('/')}
      // rightSection={
      //   <Popover
      //     width={300}
      //     trapFocus
      //     position="bottom-end"
      //     withArrow
      //     shadow="md"
      //   >
      //     <Popover.Target>
      //       <ActionIcon
      //         ref={ref}
      //         color="blue"
      //         variant="filled"
      //         className="mr-2"
      //       >
      //         <Edit className="h-4 w-4" />
      //       </ActionIcon>
      //     </Popover.Target>
      //     <Popover.Dropdown>
      //       <Accordion defaultValue="Apples">{items}</Accordion>
      //     </Popover.Dropdown>
      //   </Popover>
      // }
      disabled
    />
  );
};
