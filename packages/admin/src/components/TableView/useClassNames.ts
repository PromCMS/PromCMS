import clsx from 'clsx'

export const useClassNames = () => ({
  tableHead: clsx(
    `border-b-2 border-gray-100 px-5 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600`
  ),
  tableData: clsx(
    'border-b border-gray-200 bg-white px-5 py-5 group-last:border-opacity-0'
  ),
  tableDataParagraph: clsx(
    'w-full max-w-[350px] overflow-hidden truncate text-gray-900'
  ),
  tableWrapper: clsx(
    'inline-block w-full min-w-full overflow-hidden overflow-x-auto bg-white px-7 relative'
  ),
  tableRow: clsx('bg-white rounded-lg group'),
})
