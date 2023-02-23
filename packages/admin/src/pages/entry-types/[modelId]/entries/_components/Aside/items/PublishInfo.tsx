import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { MESSAGES, pageUrls } from '@constants';
import useCurrentModel from '@hooks/useCurrentModel';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useUser } from '@hooks/useUser';
import { Skeleton, SkeletonProps } from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import { dynamicDayjs } from '@utils';
import clsx from 'clsx';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEntryUnderpageContext } from '../../../_context';

const TextSkeleton: FC<SkeletonProps> = ({ className, ...rest }) => (
  <Skeleton
    className={clsx('relative top-0.5 inline-block h-4', className)}
    {...rest}
  />
);

const UserName: FC<{ userId?: ItemID }> = ({ userId }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUser(userId, {
    enabled: !!userId,
  });
  const currentUser = useCurrentUser();
  const userIsCurrentUser = Number(userId) === Number(currentUser?.id);

  return isLoading || !data || !userId ? (
    <TextSkeleton className="inline-block" />
  ) : (
    <Link
      to={userIsCurrentUser ? '/settings/profile' : pageUrls.users.view(userId)}
      className="font-semibold text-blue-600"
    >
      {userIsCurrentUser ? t('Me') : data.name}
    </Link>
  );
};

const dateFormat = 'D.M. YYYY, HH:mm';

export const PublishInfo: FC = () => {
  const { itemData, itemIsLoading, currentView } = useEntryUnderpageContext();
  const { t } = useTranslation();
  const currentModel = useCurrentModel();

  if (!currentModel?.hasTimestamps && !currentModel?.ownable) {
    return null;
  }

  return (
    <AsideItemWrap className="!pt-0" title={t(MESSAGES.PUBLISH_INFO)}>
      {currentView === 'update' && (
        <div className="w-full px-4 py-5">
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {currentModel?.hasTimestamps && (
              <>
                <li>
                  {t('Updated at')}:{' '}
                  {itemIsLoading ? (
                    <TextSkeleton className="w-full max-w-[6rem]" />
                  ) : (
                    <span className="font-semibold text-blue-600">
                      {!!itemData?.updated_at
                        ? dynamicDayjs(itemData.updated_at).format(dateFormat)
                        : t('Not edited yet')}
                    </span>
                  )}
                </li>
                {!!itemData?.created_at && (
                  <li>
                    {t('Created at')}:{' '}
                    {itemIsLoading ? (
                      <TextSkeleton className="w-full max-w-[6rem]" />
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {dynamicDayjs(itemData.created_at).format(dateFormat)}
                      </span>
                    )}
                  </li>
                )}
              </>
            )}
            {currentModel?.ownable && (
              <>
                {!!itemData?.updated_by &&
                  String(itemData?.updated_by) !== '0' && (
                    <li>
                      <div className="flex items-center gap-1">
                        <span className="flex-none">{t('Updated by')}:</span>{' '}
                        <UserName userId={itemData?.updated_by} />
                      </div>
                    </li>
                  )}

                <li>
                  <div className="flex items-center gap-1">
                    <span className="flex-none">{t('Created by')}:</span>{' '}
                    {!!itemData?.created_by &&
                    String(itemData?.created_by) !== '0' ? (
                      <UserName userId={itemData?.created_by} />
                    ) : (
                      t('Unknown')
                    )}
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </AsideItemWrap>
  );
};
