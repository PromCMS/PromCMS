import clsx from 'clsx';

export const useClassNames = () => ({
  itemsWrap: clsx(
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-7 items-start'
  ),
  itemRoot: clsx('relative block group'),
  itemSquare: (isInteractible: boolean = true) =>
    clsx(
      'aspect-square w-full rounded-lg bg-white shadow-md overflow-hidden relative',
      isInteractible ? 'group-hover:shadow-lg duration-200' : 'cursor-default'
    ),
  itemLabel: clsx(
    'mt-2 overflow-hidden text-ellipsis font-semibold group-hover:underline'
  ),
});
