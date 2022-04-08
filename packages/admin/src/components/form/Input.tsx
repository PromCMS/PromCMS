import { Label } from './Label'
import clsx from 'clsx'
import {
  cloneElement,
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
} from 'react'

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
  prefixIcon?: ReactElement
  error?: string
  touched?: boolean
  wrapperClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    prefixIcon,
    className,
    error,
    touched,
    disabled,
    wrapperClassName,
    ...rest
  },
  ref
) {
  return (
    <div className={wrapperClassName}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        {prefixIcon &&
          cloneElement(prefixIcon, {
            className: clsx(
              prefixIcon.props.className,
              'w-5 h-5 absolute left-4 transform -translate-y-1/2 top-1/2 text-gray-400'
            ),
          })}
        <input
          ref={ref}
          disabled={disabled}
          className={clsx(
            'mt-1 block rounded-lg border-2 bg-white py-2 px-3.5 placeholder-gray-400 outline-none focus:border-indigo-500',
            prefixIcon && 'pl-10',
            disabled && 'cursor-not-allowed opacity-50',
            error ? 'border-red-500' : 'border-project-border',
            className
          )}
          {...rest}
        />
      </div>
      {error && <small className="font-bold text-red-500">{error}</small>}
    </div>
  )
})

export default Input
