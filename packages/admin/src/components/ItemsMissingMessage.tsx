import { MESSAGES } from '@constants';
import clsx from 'clsx';
import { DetailedHTMLProps, HTMLAttributes, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionMark } from 'tabler-icons-react';

export type ItemsMissingMessageProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const ItemsMissingMessage: VFC<ItemsMissingMessageProps> = ({
  className,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'flex flex-col justify-center text-center text-xl font-semibold text-gray-400',
        className
      )}
      {...rest}
    >
      <QuestionMark
        size={45}
        className="mx-auto bg-white rounded-full shadow-lg p-2"
      />
      <p className="mt-2">{t(MESSAGES.NO_ITEMS_YET_PLACEHOLDER)}</p>
    </div>
  );
};

export default ItemsMissingMessage;
