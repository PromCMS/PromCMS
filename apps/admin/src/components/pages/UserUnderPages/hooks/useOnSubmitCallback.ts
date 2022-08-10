import { ApiResultItem } from '@prom-cms/shared';
import { UserService } from '@services';
import { useTranslation } from 'react-i18next';
import { getObjectDiff } from '@utils';
import { useData } from '../context';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import axios from 'axios';
import { useFormContext } from 'react-hook-form';
import { MESSAGES } from '@constants';
import { useNavigate } from 'react-router-dom';

export const useOnSubmitCallback = () => {
  const navigate = useNavigate();
  const { view, user, mutateUser } = useData();
  const reqNotification = useRequestWithNotifications();
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
            const result = await UserService.update(
              user?.id as number,
              getObjectDiff(user, values) as ApiResultItem
            );

            await mutateUser(
              (prev) => {
                if (prev && result?.data?.data) {
                  return { ...prev, ...result.data.data };
                }
              },
              { revalidate: false }
            );
          } else if (view === 'create') {
            const result = await UserService.create(
              getObjectDiff(user || {}, values) as ApiResultItem
            );

            if (result?.data) {
              navigate(UserService.getListUrl());
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
