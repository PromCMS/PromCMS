import clsx from 'clsx'
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

const AsideItemWrap: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className, title, ...rest }) => (
  <div
    className={clsx(
      'rounded-lg shadow-lg shadow-blue-100 border-2 border-project-border',
      className
    )}
    {...rest}
  >
    {title && (
      <div className=" bg-white w-full rounded-t-lg px-4 py-4 border-b-2 border-project-border text-2xl font-semibold">
        {title}
      </div>
    )}
    {children}
  </div>
)

export default AsideItemWrap
