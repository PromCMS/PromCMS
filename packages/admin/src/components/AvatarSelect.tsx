import { MESSAGES } from '@constants';
import { getInitials } from '@utils';
import clsx from 'clsx';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { User } from '@prom-cms/api-client';

import ImageSelect from './form/ImageSelect';

export const AvatarSelect: FC<{ user: Pick<User, 'name'> | null }> = ({
  user,
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      name="avatar"
      render={({ field: { onChange, onBlur, value }, fieldState }) => {
        return (
          <ImageSelect
            label={t(MESSAGES.AVATAR)}
            error={t(fieldState.error?.message ?? '')}
            selected={value}
            multiple={false}
            onChange={(nextValue) => nextValue && onChange(nextValue)}
            onBlur={onBlur}
            wrapperClassName={clsx('md:w-3/6 w-full text-left')}
            classNames={{
              wrapper: 'flex-col items-start gap-3',
              imageWrapper:
                'relative w-full aspect-square rounded-prom overflow-hidden',
            }}
            imageProps={{
              width: 400,
            }}
            placeholderElement={
              <div className="m-auto text-4xl">
                {getInitials(user?.name || '-- --')}
              </div>
            }
            imageWrapperProps={{ disableStyles: true }}
          />
        );
      }}
    />
  );
};
