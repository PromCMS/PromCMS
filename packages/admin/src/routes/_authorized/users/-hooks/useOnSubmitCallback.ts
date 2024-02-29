import { apiClient } from '@api';
import { MESSAGES, pageUrls } from '@constants';
import { useNavigate } from '@tanstack/react-router';
import { getObjectDiff, toastedPromise } from '@utils';
import axios from 'axios';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useData } from '../-context';
import { useCurrentUser } from './useCurrentUser';

export const useOnSubmitCallback = () => {
  const navigate = useNavigate();
  const { data: currentUser, refetch } = useCurrentUser();
  const { view } = useData();
  const { t } = useTranslation();
  const { setError } = useFormContext();

  const callback = async (values) => {
    try {
      await toastedPromise(
        {
          title: view === 'update' ? 'Updating' : 'Creating',
          message: t(
            view === 'update'
              ? 'Updating user data, please wait'
              : 'Creating new user, please wait'
          ),
          successMessage: t(
            view === 'update'
              ? 'User data has been updated!'
              : 'New user has been created!'
          ),
          errorMessage: (e) => {
            if (axios.isAxiosError(e) && e.response?.status === 409) {
              return t(MESSAGES.DUPLICATE_USER);
            } else {
              return t(MESSAGES.ERROR_BASIC);
            }
          },
        },
        async () => {
          if (view === 'update') {
            await apiClient.users.update(
              currentUser?.id as number,
              getObjectDiff(currentUser, values)
            );

            await refetch();
          } else if (view === 'create') {
            const result = await apiClient.users.create(
              getObjectDiff(currentUser || {}, values)
            );

            if (result?.data) {
              navigate({ to: pageUrls.users.list });
            }
          }
        }
      );
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        setError('email', { message: t(MESSAGES.DUPLICATE_USER) });
      }
    }
  };

  return callback;
};
