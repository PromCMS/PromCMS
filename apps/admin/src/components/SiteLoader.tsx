import InfiniteHorizontalProgress from '@components/InfiniteHorizontalProgress';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { memo, FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface LoaderProps {
  show?: boolean;
  text?: string;
  fullScreen?: boolean;
}

export const Loader: FC<LoaderProps> = memo(function Loader({
  text,
  show = true,
  fullScreen = true,
}) {
  const { t } = useTranslation();

  return (
    <Transition
      show={show}
      as="div"
      className={clsx(
        fullScreen ? 'fixed' : 'absolute',
        'top-0 left-0 z-50 grid h-full min-h-screen w-full content-center items-center bg-white'
      )}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="text-center text-2xl text-gray-400">
        <p>{t('Loading, please wait...')}</p>
        <InfiniteHorizontalProgress className="mx-auto mt-3 h-3 w-[400px]" />
      </div>
    </Transition>
  );
});
