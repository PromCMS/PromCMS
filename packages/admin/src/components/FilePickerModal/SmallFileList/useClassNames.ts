import clsx from 'clsx';

export const useClassNames = () => ({
  itemsWrap: clsx(
    'grid grid-cols-1 sm:grid-cols-2 gap-7 items-start min-h-[200px] my-3 py-3 max-h-[520px] overflow-auto relative'
  ),
  itemRoot: clsx('relative block group'),
  itemSquare: (isInteractible: boolean = true) =>
    clsx(
      'aspect-square sm:aspect-[3/2] w-full rounded-lg bg-white shadow-md overflow-hidden relative',
      isInteractible ? 'group-hover:shadow-lg duration-200' : 'cursor-default'
    ),
  itemLabel: clsx(
    'mt-2 overflow-hidden text-ellipsis font-semibold group-hover:underline text-left mb-0 leading-8 block whitespace-nowrap'
  ),
});
