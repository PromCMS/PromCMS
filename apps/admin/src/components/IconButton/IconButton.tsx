import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import { Icon } from 'tabler-icons-react';

export interface IconButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: Icon;
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
    );
  }
);
