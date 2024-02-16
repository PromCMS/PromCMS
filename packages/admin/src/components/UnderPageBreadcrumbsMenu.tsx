import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, Fragment, HTMLAttributes } from 'react';
import { Home } from 'tabler-icons-react';

export interface UnderPageBreadcrumbsMenuProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  items: { content: string | any; isLinkTo?: string }[];
}

const CustomChevronRight: FC = () => (
  <span className="mx-2 flex-none text-xl font-bold text-gray-300">/</span>
);

const UnderPageBreadcrumbsMenu: FC<UnderPageBreadcrumbsMenuProps> = ({
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
      <Link className="flex-none hover:underline" to="/">
        <Home className="w-5" />
      </Link>
      {items.map(({ content, isLinkTo }, key) => (
        <Fragment key={key}>
          <CustomChevronRight />
          {isLinkTo ? (
            <Link to={isLinkTo} className="flex-none hover:underline">
              {content}
            </Link>
          ) : (
            <div className="flex-none">{content}</div>
          )}
        </Fragment>
      ))}
    </nav>
  );
};

export default UnderPageBreadcrumbsMenu;
