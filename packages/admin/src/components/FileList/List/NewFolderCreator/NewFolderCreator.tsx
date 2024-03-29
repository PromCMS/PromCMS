import { apiClient } from '@api';
import axios from 'axios';
import clsx from 'clsx';
import { useFileFolder } from 'hooks/useFileFolder';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FolderPlus } from 'tabler-icons-react';

import { useFileListContext } from '../../context';
import { useClassNames } from '../../useClassNames';

export const NewFolderCreator: FC<{ styles: any }> = ({ styles = {} }) => {
  const { updateValue, currentPath } = useFileListContext();
  const classNames = useClassNames();
  const { t } = useTranslation();
  const { register, handleSubmit, setFocus, formState, setError } = useForm<{
    name: string;
  }>();

  const { refetchFolders } = useFileFolder(currentPath);

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  const onSubmit = async ({ name }) => {
    try {
      await apiClient.library.folders.create(`${currentPath}/${name}`);
      await refetchFolders();
      updateValue('showNewFolderCreator', false);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        setError('name', { message: 'This folder already exists' });
        return false;
      }
      throw e;
    }
  };

  const onBlur = () => {
    if (!formState.isSubmitting) {
      updateValue('showNewFolderCreator', false);
    }
  };

  return (
    <div
      className={clsx(
        classNames.itemRoot,
        'text-left',
        formState.isSubmitting && 'cursor-wait'
      )}
      style={styles}
    >
      <div className={clsx(classNames.itemSquare(false), 'flex')}>
        <FolderPlus className="m-auto h-16 w-16 text-blue-500" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <input
          className="mt-1 w-full !border-b-2 !border-blue-200 bg-transparent text-lg font-medium outline-0 disabled:opacity-50"
          disabled={formState.isSubmitting || formState.isSubmitSuccessful}
          autoComplete="off"
          {...register('name', { onBlur })}
        />
        {formState.errors?.['name']?.message && (
          <small className="b-0 translate-y-full text-lg font-semibold text-red-500">
            {t(formState.errors['name'].message)}
          </small>
        )}
      </form>
    </div>
  );
};
