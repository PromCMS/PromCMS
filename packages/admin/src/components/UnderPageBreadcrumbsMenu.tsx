import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, ReactChild, VFC } from 'react'
import Link from 'next/link'
import { HomeIcon } from '@heroicons/react/solid'

export interface UnderPageBreadcrumbsMenuProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  items: { content: string | ReactChild | ReactChild[]; isLinkTo?: string }[]
}

const CustomChevronRight: VFC = () => (
  <span className="mx-2 flex-none text-xl font-bold text-gray-300">/</span>
)

const UnderPageBreadcrumbsMenu: VFC<UnderPageBreadcrumbsMenuProps> = ({
  items,
  className,
  ...rest
}) => {
  return (
    <nav
      className={clsx(
        'flex items-center gap-2 overflow-auto text-sm font-bold uppercase text-blue-300',
        className
      )}
      {...rest}
    >
      <Link href="/">
        <a className="flex-none hover:underline">
          <HomeIcon className="w-5" />
        </a>
      </Link>
      {items.map(({ content, isLinkTo }) => (
        <>
          <CustomChevronRight />
          {isLinkTo ? (
            <Link href={isLinkTo}>
              <a className="flex-none hover:underline">{content}</a>
            </Link>
          ) : (
            <p className="flex-none">{content}</p>
          )}
        </>
      ))}
    </nav>
  )
}

export default UnderPageBreadcrumbsMenu
