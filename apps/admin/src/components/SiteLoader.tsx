import InfiniteHorizontalProgress from '@components/InfiniteHorizontalProgress';
import { Transition } from '@headlessui/react';
import { memo, VFC } from 'react';
import { useTranslation } from 'react-i18next';

export interface LoaderProps {
  show?: boolean;
}

export const Loader: VFC<LoaderProps> = memo(function Loader({ show = true }) {
  const { t } = useTranslation();

  return (
    <Transition
      show={show}
      as="div"
      className="fixed top-0 left-0 z-50 grid min-h-screen w-full content-center items-center bg-white"
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="text-center text-2xl text-gray-400">
        <p>{t('System is loading...')}</p>
        <InfiniteHorizontalProgress className="mx-auto mt-3 h-3 w-[400px]" />
      </div>
    </Transition>
  );
});
