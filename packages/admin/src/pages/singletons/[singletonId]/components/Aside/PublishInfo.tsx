import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { Skeleton, SkeletonProps } from '@mantine/core';
import { dynamicDayjs } from '@utils';
import clsx from 'clsx';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSingletonPageContext } from '../../context';

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

  if (!singleton?.hasTimestamps) {
    return null;
  }

  return (
    <AsideItemWrap className="!pt-0" title={t('Publish info')}>
      <div className="w-full px-4 py-5">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            {t('Updated at:')}{' '}
            {isLoading ? (
              <TextSkeleton className="w-full max-w-[6rem]" />
            ) : (
              <span className="font-semibold text-blue-600">
                {!!data?.updated_at
                  ? dynamicDayjs(data.updated_at).format(dateFormat)
                  : t('Not edited yet')}
              </span>
            )}
          </li>
          {!!data?.created_at && (
            <li>
              {t('Created at:')}{' '}
              {isLoading ? (
                <TextSkeleton className="w-full max-w-[6rem]" />
              ) : (
                <span className="font-semibold text-blue-600">
                  {dynamicDayjs(data.created_at).format(dateFormat)}
                </span>
              )}
            </li>
          )}
        </ul>
      </div>
    </AsideItemWrap>
  );
};
