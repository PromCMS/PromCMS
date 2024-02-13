import { apiClient } from '@api';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES } from '@constants';
import { useAuth } from '@contexts/AuthContext';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import { ActionIcon, Button } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { canUser, getObjectDiff } from '@utils';
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Trash } from 'tabler-icons-react';

import { UserStates } from '@prom-cms/api-client';

import { useData } from '../-context';
import { useCurrentUser } from '../-hooks/useCurrentUser';

export const Header: FC = () => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const { view, exitView } = useData();
  const { data: user, refetch: refetchUser } = useCurrentUser();
  const { t } = useTranslation();
  const formValues = watch();
  const { user: loggedInUser } = useAuth();

  const reqNotification = useRequestWithNotifications();
  const [workingState, setWorkingState] = useSetState({
    isSendingPasswordReset: false,
    isTogglingBlock: false,
  });

  const onItemDeleteRequest = async () => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      exitView();
      apiClient.users.delete(user?.id!);
    }
  };

  const isEdited = useMemo(
    () =>
      view === 'update'
        ? !!Object.keys(getObjectDiff(user || {}, formValues)).length
        : true,
    [formValues, view, user]
  );

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
          await apiClient.profile.requestPasswordReset(user!.email);

          // TODO
          // mutateUser(data.data);
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
          await apiClient.users[userIsNowBlocked ? 'unblock' : 'block'](
            user!.id
          );
          await refetchUser();
        }
      );
    } catch (e) {}
    setWorkingState({ isTogglingBlock: false });
  };

  return (
    <div className="flex items-center justify-between pb-3">
      <header className="mr-2 w-full">
        <h1 className="m-0 text-3xl font-bold">
          {t(
            view == 'update' ? MESSAGES.UPDATE_AN_USER : MESSAGES.CREATE_AN_USER
          )}
        </h1>
      </header>
      <div className="flex gap-5">
        {view === 'update' &&
          loggedInUser &&
          canUser({
            userRole: loggedInUser.role,
            action: 'update',
            targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.USERS,
          }) && (
            <>
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
            </>
          )}
        <Button
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
        {view === 'update' ? (
          <ActionIcon
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
        ) : null}
      </div>
    </div>
  );
};
