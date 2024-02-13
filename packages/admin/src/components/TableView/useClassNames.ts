import clsx from 'clsx';

export const useClassNames = () => ({
  tableHead: clsx(
    `border-b-2 border-gray-100 py-4 px-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-white dark:font-semibold`
  ),
  tableData: clsx(
    'border-b border-gray-200 bg-white dark:bg-transparent py-4 px-2 group-last:border-opacity-0'
  ),
  tableDataParagraph: clsx(
    'w-full max-w-[350px] overflow-hidden truncate text-gray-900 dark:text-white'
  ),
  tableWrapper: clsx(
    'inline-block w-full min-w-full overflow-hidden overflow-x-auto bg-white px-7 relative'
  ),
  tableRow: clsx(
    'bg-white dark:bg-transparent dark:text-white rounded-lg group'
  ),
});
