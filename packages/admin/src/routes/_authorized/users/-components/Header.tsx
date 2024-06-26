import { apiClient } from '@api';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES } from '@constants';
import { useAuth } from '@contexts/AuthContext';
import { ActionIcon, Button } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { canUser, getObjectDiff, toastedPromise } from '@utils';
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
      await toastedPromise(
        {
          title: t(MESSAGES.PLEASE_WAIT),
          message: t(
            thisIsResend
              ? MESSAGES.PASSWORD_RESET_FOR_USER_WORKING_RESEND
              : MESSAGES.PASSWORD_RESET_FOR_USER_WORKING
          ),
          successMessage: t(MESSAGES.PASSWORD_RESET_FOR_USER_DONE),
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
      await toastedPromise(
        {
          title: t(
            userIsNowBlocked
              ? MESSAGES.USER_BLOCKING_WORKING_UNBLOCK
              : MESSAGES.USER_BLOCKING_WORKING_BLOCK
          ),
          message: t(MESSAGES.PLEASE_WAIT),
          successMessage: t(
            userIsNowBlocked
              ? MESSAGES.USER_BLOCKING_DONE_BLOCKED
              : MESSAGES.USER_BLOCKING_DONE_UNBLOCKED
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
                    ? MESSAGES.PASSWORD_RESET_FOR_USER_REQUEST_AGAIN
                    : MESSAGES.PASSWORD_RESET_FOR_USER_REQUEST
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
                    ? MESSAGES.USER_BLOCKING_REQUEST_UNBLOCK
                    : MESSAGES.USER_BLOCKING_REQUEST_BLOCK
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
                ? MESSAGES.ITEM_CREATE_WORKING
                : MESSAGES.ITEM_UPDATE_WORKING
              : view === 'create'
                ? MESSAGES.CREATE_ITEM
                : MESSAGES.UPDATE_ITEM
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
