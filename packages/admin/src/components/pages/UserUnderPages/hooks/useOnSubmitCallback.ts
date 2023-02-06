import { useTranslation } from 'react-i18next';
import { getObjectDiff } from '@utils';
import { useData } from '../context';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import axios from 'axios';
import { useFormContext } from 'react-hook-form';
import { MESSAGES, pageUrls } from '@constants';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@api';

export const useOnSubmitCallback = () => {
  const navigate = useNavigate();
  const reqNotification = useRequestWithNotifications();
  const { view, user, mutateUser } = useData();
  const { t } = useTranslation();
  const { setError } = useFormContext();

  const callback = async (values) => {
    try {
      await reqNotification(
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
            const result = await apiClient.users.update(
              user?.id as number,
              getObjectDiff(user, values)
            );

            mutateUser(result.data.data);
          } else if (view === 'create') {
            const result = await apiClient.users.create(
              getObjectDiff(user || {}, values)
            );

            if (result?.data) {
              navigate(pageUrls.users.list);
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
