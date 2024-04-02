import { MESSAGES } from '@constants';
import { TextInput } from '@mantine/core';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FileItem } from '@prom-cms/api-client';

export const Filename: FC<{ file: FileItem }> = ({ file }) => {
  const { t } = useTranslation();
  const { field, fieldState, formState } = useController<FileItem>({
    name: 'filename',
  });

  const [fileExtension, ...filenameParts] = String(field.value ?? file.filename)
    .split('.')
    .reverse();
  const filename = filenameParts.reverse().join('.');

  return (
    <TextInput
      label={t(MESSAGES.FILENAME)}
      value={filename}
      disabled={formState.isSubmitting}
      error={fieldState.error?.message}
      onChange={(e) => field.onChange(`${e.target.value}.${fileExtension}`)}
      onBlur={field.onBlur}
      ref={field.ref}
      name={field.name}
      rightSectionWidth={40 + fileExtension.length * 8}
      rightSection={
        <div className="inline-block text-blue-500">.{fileExtension}</div>
      }
    />
  );
};
