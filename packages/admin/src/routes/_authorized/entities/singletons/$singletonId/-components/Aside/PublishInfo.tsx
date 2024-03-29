import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { MESSAGES } from '@constants';
import { Skeleton, SkeletonProps } from '@mantine/core';
import { dynamicDayjs } from '@utils';
import clsx from 'clsx';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useSingletonPageContext } from '../../-context';

const TextSkeleton: FC<SkeletonProps> = ({ className, ...rest }) => (
  <Skeleton
    className={clsx('relative top-0.5 inline-block h-4', className)}
    {...rest}
  />
);

const dateFormat = 'D.M. YYYY, HH:mm';

export const PublishInfo: FC = () => {
  const { data, isLoading } = useSingletonPageContext();
  const { t } = useTranslation();
  const singleton = useCurrentSingleton();

  if (!singleton?.timestamp || (!data?.updatedAt && !data?.createdAt)) {
    return null;
  }

  return (
    <AsideItemWrap className="!pt-0" title={t(MESSAGES.PUBLISH_INFO)}>
      <div className="w-full px-4 py-5">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {!!data?.updatedAt && (
            <li>
              {t(MESSAGES.UPDATED_AT)}:{' '}
              {isLoading ? (
                <TextSkeleton className="w-full max-w-[6rem]" />
              ) : (
                <span className="font-semibold text-blue-600">
                  {dynamicDayjs(data.updatedAt).format(dateFormat)}
                </span>
              )}
            </li>
          )}
          {!!data?.createdAt && (
            <li>
              {t(MESSAGES.CREATED_AT)}:{' '}
              {isLoading ? (
                <TextSkeleton className="w-full max-w-[6rem]" />
              ) : (
                <span className="font-semibold text-blue-600">
                  {dynamicDayjs(data.createdA).format(dateFormat)}
                </span>
              )}
            </li>
          )}
        </ul>
      </div>
    </AsideItemWrap>
  );
};
