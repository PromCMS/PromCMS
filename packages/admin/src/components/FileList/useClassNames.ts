import clsx from 'clsx';

export const useClassNames = () => ({
  itemsWrap: clsx(
    'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 items-start relative'
  ),
  itemRoot: clsx('relative block group'),
  itemSquare: (isInteractible: boolean = true) =>
    clsx(
      'aspect-square w-full rounded-lg bg-white shadow-md overflow-hidden relative border-blue-200 border',
      'dark:border-2 dark:bg-transparent dark:border-dashed backdrop-blur-md',
      isInteractible ? 'group-hover:shadow-lg duration-200' : 'cursor-default'
    ),
  itemLabel: clsx(
    'mt-2 overflow-hidden text-ellipsis font-semibold group-hover:underline dark:text-gray-800'
  ),
});
