import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { MESSAGES, pageUrls } from '@constants';
import { Skeleton, SkeletonProps } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { dynamicDayjs } from '@utils';
import clsx from 'clsx';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useUser } from 'hooks/useUser';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '@prom-cms/api-client';

import { useEntryUnderpageContext } from '../../../-context';
import useCurrentModel from '../../../../-useCurrentModel';

const TextSkeleton: FC<SkeletonProps> = ({ className, ...rest }) => (
  <Skeleton
    className={clsx('relative top-0.5 inline-block h-4', className)}
    {...rest}
  />
);

const UserName: FC<Partial<User>> = ({ id: userId, name: prefetchedName }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUser(userId, {
    enabled: !!userId && !prefetchedName,
  });
  const currentUser = useCurrentUser();

  const name = data?.name ?? prefetchedName;
  const userIsCurrentUser =
    Number(userId) === Number(currentUser?.id) || name === currentUser?.name;

  return (isLoading && !prefetchedName) || !name || !userId ? (
    <TextSkeleton className="inline-block" />
  ) : (
    <Link
      to={userIsCurrentUser ? '/settings/profile' : pageUrls.users.view(userId)}
      className="font-semibold text-blue-600"
    >
      {userIsCurrentUser ? t('Me') : name}
    </Link>
  );
};

const dateFormat = 'D.M. YYYY, HH:mm';

export const PublishInfo: FC = () => {
  const { itemData, itemIsLoading } = useEntryUnderpageContext();
  const { t } = useTranslation();
  const currentModel = useCurrentModel();

  return (
    <AsideItemWrap className="!pt-0" title={t(MESSAGES.PUBLISH_INFO)}>
      <div className="w-full px-4 py-5">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {currentModel?.timestamp && (
            <>
              <li>
                {t('Updated at')}:{' '}
                {itemIsLoading ? (
                  <TextSkeleton className="w-full max-w-[6rem]" />
                ) : (
                  <span className="font-semibold text-blue-600">
                    {!!itemData?.updatedAt
                      ? dynamicDayjs(itemData.updatedAt).format(dateFormat)
                      : t('Not edited yet')}
                  </span>
                )}
              </li>
              {!!itemData?.createdAt && (
                <li>
                  {t('Created at')}:{' '}
                  {itemIsLoading ? (
                    <TextSkeleton className="w-full max-w-[6rem]" />
                  ) : (
                    <span className="font-semibold text-blue-600">
                      {dynamicDayjs(itemData.createdAt).format(dateFormat)}
                    </span>
                  )}
                </li>
              )}
            </>
          )}
          {currentModel?.ownable && (
            <>
              {!!itemData?.updatedBy ? (
                <li>
                  <div className="flex items-center gap-1">
                    <span className="flex-none">{t('Updated by')}:</span>{' '}
                    <UserName {...itemData.updatedBy} />
                  </div>
                </li>
              ) : null}

              {!!itemData?.createdBy ? (
                <li>
                  <div className="flex items-center gap-1">
                    <span className="flex-none">{t('Created by')}:</span>{' '}
                    <UserName {...itemData.createdBy} />
                  </div>
                </li>
              ) : null}
            </>
          )}
        </ul>
      </div>
    </AsideItemWrap>
  );
};
