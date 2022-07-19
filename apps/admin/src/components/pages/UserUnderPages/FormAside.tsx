import AsideItemWrap from '@components/AsideItemWrap';
import Skeleton, { SkeltonProps } from '@components/Skeleton';
import clsx from 'clsx';
import { MESSAGES } from '@constants';
import { EntryService, UserService } from '@services';
import { useMemo, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getObjectDiff } from '@utils';
import { useClassNames } from '../EntryUnderpage/useClassNames';
import { useData } from './context';
import { ActionIcon, Button, SimpleGrid } from '@mantine/core';
import { UserStates } from '@prom-cms/shared';
import { useSetState } from '@mantine/hooks';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Trash } from 'tabler-icons-react';

const TextSkeleton: VFC<SkeltonProps> = ({ className, ...rest }) => (
  <Skeleton
    className={clsx('relative top-0.5 inline-block h-4', className)}
    {...rest}
  />
);

export const FormAside: VFC = () => {
  const { isLoading, view, user, exitView, mutateUser } = useData();
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const currentUser = useCurrentUser();
  const formValues = watch();
  const classes = useClassNames();
  const { t } = useTranslation();
  const reqNotification = useRequestWithNotifications();
  const [workingState, setWorkingState] = useSetState({
    isSendingPasswordReset: false,
    isTogglingBlock: false,
  });

  const isEdited = useMemo(
    () =>
      view === 'update'
        ? !!Object.keys(getObjectDiff(user || {}, formValues)).length
        : true,
    [formValues, view, user]
  );

  const onItemDeleteRequest = async () => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      exitView();
      await EntryService.delete({
        id: user?.id as number,
        model: 'users',
      });
    }
  };

  const onPasswordResetClick = async () => {
    setWorkingState({ isSendingPasswordReset: true });
    const thisIsResend = user?.state === UserStates.passwordReset;
    try {
      await reqNotification(
        {
          title: t('Password reset'),
          message: t(
            thisIsResend
              ? 'Resending password reset email'
              : 'Sending user password reset email'
          ),
          successMessage: t('User can now follow instruction in their email'),
        },
        async () => {
          const res = await UserService.requestPasswordReset(user!.id);

          await mutateUser(
            (prev) => {
              if (prev && res.data?.data) {
                return { ...prev, ...res.data.data };
              }
            },
            { revalidate: false }
          );
        }
      );
    } catch (e) {}
    setWorkingState({ isSendingPasswordReset: false });
  };

  const onToggleBlockClick = async () => {
    setWorkingState({ isTogglingBlock: true });
    const userIsNowBlocked = user!.state === UserStates.blocked;

    try {
      await reqNotification(
        {
          title: t(userIsNowBlocked ? 'Unblocking' : 'Blocking'),
          message: '',
          successMessage: t(
            userIsNowBlocked ? 'User is now unblocked' : 'User is now blocked'
          ),
        },
        async () => {
          const res = await UserService.toggleBlock(user!.id, userIsNowBlocked);
          await mutateUser(
            (prev) => {
              if (prev && res.data?.data) {
                return { ...prev, ...res.data.data };
              }
            },
            { revalidate: false }
          );
        }
      );
    } catch (e) {}
    setWorkingState({ isTogglingBlock: false });
  };

  return (
    <aside className={clsx(classes.aside, 'sticky top-0 grid gap-5')}>
      <AsideItemWrap className="!pt-0" title="Apply changes">
        {view === 'update' && (
          <div className={clsx('w-full bg-white py-5 px-4')}>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                {t('State')}:{' '}
                {isLoading ? (
                  <TextSkeleton className="w-full max-w-[6rem]" />
                ) : (
                  <span className="font-semibold text-blue-600">
                    {user?.state}
                  </span>
                )}
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-5 border-t-2 border-project-border px-4 py-4">
          {view === 'update' ? (
            <ActionIcon
              size="lg"
              type="button"
              loading={isSubmitting}
              onClick={onItemDeleteRequest}
              color="red"
              variant="light"
              className={clsx(
                isSubmitting && '!cursor-progress',
                'text-sm text-red-500'
              )}
            >
              <Trash className="aspect-square w-5" />
            </ActionIcon>
          ) : (
            <span></span>
          )}
          <Button
            size="lg"
            color="green"
            type="submit"
            disabled={isSubmitting || !isEdited}
            loading={isSubmitting}
            className={clsx(isSubmitting && '!cursor-progress')}
          >
            {t(
              isSubmitting
                ? view === 'create'
                  ? 'Creating...'
                  : 'Updating...'
                : view === 'create'
                ? 'Create'
                : 'Update'
            )}
          </Button>
        </div>
      </AsideItemWrap>
      {view === 'update' &&
        currentUser?.can({
          action: 'update',
          targetModel: 'users',
        }) && (
          <AsideItemWrap title={t('Actions')}>
            <SimpleGrid cols={1} className="p-5">
              <Button
                loading={workingState.isSendingPasswordReset}
                disabled={!user || user?.state === UserStates.blocked}
                onClick={onPasswordResetClick}
              >
                {t(
                  user?.state === UserStates.passwordReset
                    ? 'Resend password reset'
                    : 'Send password reset'
                )}
              </Button>
              <Button
                loading={workingState.isTogglingBlock}
                disabled={!user}
                color="red"
                onClick={onToggleBlockClick}
              >
                {t(
                  user?.state === UserStates.blocked
                    ? 'Unblock user'
                    : 'Block user'
                )}
              </Button>
            </SimpleGrid>
          </AsideItemWrap>
        )}
    </aside>
  );
};
