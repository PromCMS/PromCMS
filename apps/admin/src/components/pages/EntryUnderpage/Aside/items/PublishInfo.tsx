import AsideItemWrap from '@components/AsideItemWrap';
import useCurrentModel from '@hooks/useCurrentModel';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useUser } from '@hooks/useUser';
import { Skeleton, SkeletonProps } from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import { UserService } from '@services';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryUnderpageContext } from '../../context';

const TextSkeleton: FC<SkeletonProps> = ({ className, ...rest }) => (
  <Skeleton
    className={clsx('relative top-0.5 inline-block h-4', className)}
    {...rest}
  />
);

const UserName: FC<{ userId?: ItemID }> = ({ userId }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUser(userId, {
    isPaused: () => !userId,
  });
  const currentUser = useCurrentUser();
  const userIsCurrentUser = Number(userId) === Number(currentUser?.id);

  return isLoading || !data || !userId ? (
    <TextSkeleton className="inline-block" />
  ) : (
    <Link
      href={
        userIsCurrentUser ? '/settings/profile' : UserService.getUrl(userId)
      }
    >
      <a className="font-semibold text-blue-600">
        {userIsCurrentUser ? t('Me') : data.name}
      </a>
    </Link>
  );
};

const dateFormat = 'D.M. YYYY @ HH:mm';

export const PublishInfo: FC = () => {
  const { itemData, itemIsLoading, currentView } = useEntryUnderpageContext();
  const { t } = useTranslation();
  const currentModel = useCurrentModel();

  if (!currentModel?.hasTimestamps && !currentModel?.ownable) {
    return null;
  }

  return (
    <AsideItemWrap className="!pt-0" title={t('Publish info')}>
      {currentView === 'update' && (
        <div className="w-full px-4 py-5">
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {currentModel?.hasTimestamps && (
              <>
                {!!itemData?.updated_at && (
                  <li>
                    {t('Updated at:')}{' '}
                    {itemIsLoading ? (
                      <TextSkeleton className="w-full max-w-[6rem]" />
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {dayjs(itemData?.updated_at).format(dateFormat)}
                      </span>
                    )}
                  </li>
                )}
                {!!itemData?.created_at && (
                  <li>
                    {t('Created at:')}{' '}
                    {itemIsLoading ? (
                      <TextSkeleton className="w-full max-w-[6rem]" />
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {dayjs(itemData?.created_at).format(dateFormat)}
                      </span>
                    )}
                  </li>
                )}
              </>
            )}
            {currentModel?.ownable && (
              <>
                {itemData?.updated_by && String(itemData?.updated_by) !== '0' && (
                  <li>
                    <div className="flex items-center gap-1">
                      <span className="flex-none">{t('Updated by:')}</span>{' '}
                      <UserName userId={itemData?.updated_by} />
                    </div>
                  </li>
                )}
                {itemData?.created_by && String(itemData?.created_by) !== '0' && (
                  <li>
                    <div className="flex items-center gap-1">
                      <span className="flex-none">{t('Created by:')}</span>{' '}
                      <UserName userId={itemData?.created_by} />
                    </div>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </AsideItemWrap>
  );
};
