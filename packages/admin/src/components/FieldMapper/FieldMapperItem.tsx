import { FileSelect } from '@components/form/FileSelect';
import ImageSelect from '@components/form/ImageSelect';
import { BlockEditor } from '@components/form/editors/BlockEditor';
import { WysiwygEditor } from '@components/form/editors/WysiwygEditor';
import {
  Checkbox,
  ColorInput,
  Input,
  TextInput,
  Textarea,
  clsx,
} from '@mantine/core';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ColumnType, FieldPlacements } from '@prom-cms/schema';

import { useEntryUnderpageContext } from '../../routes/_authorized/entities/$modelId/$entryId/-context';
import { EnumSelect, RelationshipItemSelect } from './fields';
import { BigImagePicker } from './fields/BigImagePicker';
import { Email } from './fields/Email';
import { UrlFieldInput } from './fields/UrlFieldInput';
import { JsonFieldInputAsLinkButton } from './fields/json/JsonFieldInputAsLinkButton';
import { OpeningHours } from './fields/json/OpeningHours';
import { Repeater } from './fields/json/Repeater';

export const FieldMapperItem: FC<
  { placement: FieldPlacements } & ColumnType
> = ({ placement, ...values }) => {
  const { title, type, admin, readonly, name: columnName } = values;
  const { formState, register, control } =
    useFormContext<Record<string, string | boolean | number>>();
  const { t } = useTranslation();
  const { currentView } = useEntryUnderpageContext();
  const errorMessage = t(formState.errors[columnName]?.message || '');

  let result: JSX.Element | null = null;
  const disabled =
    (currentView === 'update' && readonly) || formState.isSubmitting;

  switch (type) {
    case 'string':
    case 'number':
      if (type === 'string' && admin.fieldType === 'heading') {
        result = (
          <div className="relative w-full mb-4 ">
            <input
              className={clsx(
                clsx(
                  'w-full !border-b-2 border-project-border bg-transparent pb-2 text-5xl font-bold outline-none duration-200',
                  errorMessage ? 'border-red-500' : 'focus:border-blue-500'
                )
              )}
              placeholder={t('Title here...')}
              disabled={disabled}
              {...register(columnName)}
            />
            {errorMessage ? (
              <small className="font-bold text-red-500">{errorMessage}</small>
            ) : null}
          </div>
        );
      } else {
        result = (
          <TextInput
            label={title}
            type={type === 'string' ? 'text' : type}
            className="w-full"
            autoComplete="off"
            error={errorMessage}
            disabled={disabled}
            {...register(columnName)}
          />
        );
      }

      break;

    case 'longText':
      switch (admin.fieldType) {
        case 'normal':
          result = (
            <Textarea
              autosize
              minRows={7}
              label={title}
              className="w-full"
              error={errorMessage}
              disabled={disabled}
              {...register(columnName)}
            />
          );
          break;

        case 'wysiwyg':
          result = (
            <WysiwygEditor
              label={title}
              disabled={disabled}
              name={columnName}
            />
          );
          break;
      }
      break;

    case 'enum':
      result = (
        <EnumSelect
          error={errorMessage}
          disabled={disabled}
          columnName={columnName}
          {...values}
        />
      );
      break;

    case 'relationship':
      result = (
        <RelationshipItemSelect
          error={errorMessage}
          disabled={disabled}
          columnName={columnName}
          {...values}
        />
      );
      break;

    case 'email':
      result = (
        <Email disabled={disabled} columnName={columnName} {...values} />
      );
      break;

    case 'url':
      result = (
        <UrlFieldInput
          disabled={disabled}
          columnName={columnName}
          {...values}
        />
      );
      break;

    case 'file':
      switch (values.admin.fieldType) {
        case 'big-image':
          result = (
            <BigImagePicker
              errorMessage={errorMessage}
              label={values.title}
              disabled={disabled}
              {...values}
            />
          );
          break;
        case 'small-image':
          result = (
            <Controller
              name={columnName}
              render={({ field: { onChange, value } }) => (
                <ImageSelect
                  onChange={onChange}
                  selected={value ? String(value) : null}
                  error={errorMessage}
                  label={values.title}
                  disabled={disabled}
                  {...values}
                />
              )}
            />
          );
        case 'normal':
          result = (
            <Controller
              name={columnName}
              render={({ field: { onChange, value } }) => (
                <FileSelect
                  onChange={onChange}
                  selected={value ? String(value) : null}
                  error={errorMessage}
                  label={values.title}
                  disabled={disabled}
                  {...values}
                />
              )}
            />
          );
          break;
      }
      break;

    case 'boolean':
      result = (
        <Controller
          control={control}
          name={columnName}
          render={({ field: { onChange, value } }) => (
            <Input.Wrapper size="md" label={title} error={errorMessage}>
              <Checkbox
                checked={!!value}
                size={'md'}
                onChange={(event) => onChange(event.currentTarget.checked)}
                label={t(value ? 'Yes' : 'No')}
                className="mt-1"
                disabled={disabled}
              />
            </Input.Wrapper>
          )}
        />
      );
      break;

    case 'json':
      switch (admin.fieldType) {
        case 'linkButton':
          result = (
            <JsonFieldInputAsLinkButton
              disabled={disabled}
              columnName={columnName}
              {...values}
            />
          );
          break;
        case 'blockEditor':
          result = <BlockEditor name={columnName} disabled={disabled} />;
          break;
        case 'color':
          result = (
            <Controller
              name={`${columnName}.value`}
              render={({ field, fieldState }) => (
                <ColorInput
                  {...field}
                  label={title}
                  disallowInput
                  error={fieldState.error?.message}
                  disabled={disabled}
                />
              )}
            />
          );
          break;
        case 'openingHours':
          result = (
            <OpeningHours
              label={title}
              name={columnName}
              placement={placement}
              disabled={disabled}
            />
          );
          break;
        case 'repeater':
          result = (
            <Repeater
              label={title}
              name={columnName}
              columns={(values.admin as any).columns as any}
              placement={placement}
              disabled={disabled}
              readonly={readonly}
            />
          );
          break;
        default:
          result = (
            <Textarea
              autosize
              minRows={7}
              label={title}
              className="w-full"
              error={errorMessage}
              disabled={disabled}
              {...register(columnName)}
            />
          );
          break;
      }

      break;
  }

  return result;
};
