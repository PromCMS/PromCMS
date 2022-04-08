import { HomeIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { ButtonHTMLAttributes, DetailedHTMLProps, FC, forwardRef } from 'react'

export interface IconButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: typeof HomeIcon
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, icon: Icon, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={clsx('rounded-lg bg-white p-1.5 text-gray-400', className)}
        {...rest}
      >
        <Icon className="aspect-square w-6" />
        {children}
      </button>
    )
  }
)
