import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { DetailedHTMLProps, forwardRef, SelectHTMLAttributes, VFC } from 'react'
import { Label } from './Label'

export interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label?: string
  emptyPlaceholder: string
  error?: string
  options: [optionValue: string, optionLabel: string][]
  wrapperClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      emptyPlaceholder,
      error,
      wrapperClassName,
      disabled,
      options,
      multiple,
      className,
      ...rest
    },
    ref
  ) {
    return (
      <div className={wrapperClassName}>
        {label && <Label>{label}</Label>}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            multiple={multiple}
            className={clsx(
              'block rounded-lg border-2 bg-white py-2 px-3.5 placeholder-gray-400 outline-none focus:border-indigo-500',
              label && 'mt-1',
              disabled && 'cursor-not-allowed opacity-50',
              error ? 'border-red-500' : 'border-project-border',
              className
            )}
            {...rest}
          >
            {emptyPlaceholder && (
              <option value="" disabled selected>
                {emptyPlaceholder}
              </option>
            )}
            {options.map(([optionValue, optionLabel]) => (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            ))}
          </select>
          <iconSet.ChevronDownIcon className="pointer-events-none absolute top-2 right-2 aspect-square w-8" />
        </div>
        {error && <small className="font-bold text-red-500">{error}</small>}
      </div>
    )
  }
)
