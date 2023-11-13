import { useEntryUnderpageContext } from '@pages/entry-types/[modelId]/entries/_context';
import { ColumnType, FieldPlacements } from '@prom-cms/schema';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnumSelect, RelationshipItemSelect } from './fields';
import { BigImagePicker } from './fields/BigImagePicker';
import { OpeningHours } from './fields/json/OpeningHours';
import { Repeater } from './fields/json/Repeater';
import { BlockEditor } from '@components/form/BlockEditor';
import {
  Checkbox,
  clsx,
  ColorInput,
  Input,
  Textarea,
  TextInput,
} from '@mantine/core';
import { Controller } from 'react-hook-form';
import { Email } from './fields/Email';
import { UrlFieldInput } from './fields/UrlFieldInput';
import { JsonFieldInputAsLinkButton } from './fields/json/JsonFieldInputAsLinkButton';
import ImageSelect from '@components/form/ImageSelect';
import { FileSelect } from '@components/form/FileSelect';
import { WysiwygEditor } from '@components/form/editors/WysiwygEditor';

export const FieldMapperItem: FC<
  { placement: FieldPlacements; columnName: string } & ColumnType
> = ({ placement, ...values }) => {
  const { title, type, columnName, admin, readonly } = values;
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
          <div className="relative w-full">
            <input
              className={clsx(
                'w-full !border-b-2 border-project-border bg-transparent pb-5 text-5xl font-bold outline-none duration-200 focus:border-blue-500'
              )}
              placeholder={t('Title here...')}
              disabled={disabled}
              {...register(columnName)}
            />
            {formState.errors?.[columnName]?.message ? (
              <small className="font-bold text-red-500">
                {formState.errors[columnName]!.message}
              </small>
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
        <EnumSelect error={errorMessage} disabled={disabled} {...values} />
      );
      break;

    case 'relationship':
      result = (
        <RelationshipItemSelect
          error={errorMessage}
          disabled={disabled}
          {...values}
        />
      );
      break;

    case 'email':
      result = <Email disabled={disabled} {...values} />;
      break;

    case 'url':
      result = <UrlFieldInput disabled={disabled} {...values} />;
      break;

    case 'file':
      switch (values.admin.fieldType) {
        case 'big-image':
          result = (
            <BigImagePicker
              name={columnName}
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
            <JsonFieldInputAsLinkButton disabled={disabled} {...values} />
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
