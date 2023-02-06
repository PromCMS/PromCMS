import * as iconSet from 'tabler-icons-react';
import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import styles from './button.module.scss';

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 'large' | 'normal' | 'small';
  color?: 'success' | 'ghost' | 'warning' | 'error';
  icon?: keyof typeof iconSet;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    size = 'normal',
    color,
    type = 'button',
    icon,
    ...rest
  },
  ref
) {
  const Icon = icon && iconSet[icon];

  return (
    <button
      ref={ref}
      className={clsx(
        styles.root,
        styles[`size--${size}`],
        color && styles[`color--${color}`],
        className
      )}
      type={type}
      {...rest}
    >
      {Icon && <Icon className="mr-1.5 -ml-1 -mt-1 inline aspect-square w-5" />}
      {children}
    </button>
  );
});

export default Button;
