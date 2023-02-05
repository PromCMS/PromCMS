import { BlockEditor } from '@components/form/BlockEditor';
import { Checkbox, clsx, Input, Textarea, TextInput } from '@mantine/core';
import { ColumnType, FieldPlacements } from '@prom-cms/shared';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ImageSelect from '../form/ImageSelect';
import { EnumSelect, RelationshipItemSelect } from './fields';

export interface FieldMapperProps {
  type: FieldPlacements;
  fields: (ColumnType & {
    columnName: string;
  })[][];
}

const FieldMapper: FC<FieldMapperProps> = ({ fields }) => {
  const { formState, register, control } =
    useFormContext<Record<string, string | boolean | number>>();
  const { t } = useTranslation();

  return (
    <>
      {fields.map((rowItems, rowIndex) =>
        rowItems.length ? (
          <div key={rowIndex} className="grid w-full gap-5">
            {rowItems.map((values) => {
              const { title, type, columnName, admin } = values;
              const errorMessage = t(
                formState.errors[columnName]?.message || ''
              );

              let result: JSX.Element | null = null;

              switch (type) {
                case 'string':
                case 'number':
                  if (type === 'string' && admin.fieldType === 'heading') {
                    result = (
                      <div key={columnName} className="relative w-full">
                        <input
                          className={clsx(
                            'w-full !border-b-2 border-project-border bg-transparent pb-5 text-5xl font-bold outline-none duration-200 focus:border-blue-500'
                          )}
                          placeholder={t('Title here...')}
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
                        key={columnName}
                        label={title}
                        type={type === 'string' ? 'text' : type}
                        className="w-full"
                        autoComplete="off"
                        error={errorMessage}
                        {...register(columnName)}
                      />
                    );
                  }

                  break;

                case 'longText':
                  result = (
                    <Textarea
                      key={columnName}
                      autosize
                      minRows={7}
                      label={title}
                      className="w-full"
                      error={errorMessage}
                      {...register(columnName)}
                    />
                  );
                  break;

                case 'enum':
                  result = (
                    <EnumSelect
                      key={columnName}
                      error={errorMessage}
                      {...values}
                    />
                  );
                  break;

                case 'relationship':
                  result = (
                    <RelationshipItemSelect
                      key={columnName}
                      error={errorMessage}
                      {...values}
                    />
                  );
                  break;

                case 'file':
                  result = (
                    <Controller
                      key={columnName}
                      control={control}
                      name={columnName}
                      render={({ field: { onChange, value } }) => (
                        <ImageSelect
                          onChange={onChange}
                          selected={String(value)}
                          error={errorMessage}
                          label={values.title}
                          {...(values as any)}
                        />
                      )}
                    />
                  );
                  break;

                case 'boolean':
                  result = (
                    <Controller
                      key={columnName}
                      control={control}
                      name={columnName}
                      render={({ field: { onChange, value } }) => (
                        <Input.Wrapper
                          size="md"
                          label={title}
                          error={errorMessage}
                        >
                          <Checkbox
                            checked={!!value}
                            size={'md'}
                            onChange={(event) =>
                              onChange(event.currentTarget.checked)
                            }
                            label={t(value ? 'Yes' : 'No')}
                            className="mt-1"
                          />
                        </Input.Wrapper>
                      )}
                    />
                  );
                  break;

                case 'json':
                  switch (admin.fieldType) {
                    case 'blockEditor':
                      result = (
                        <BlockEditor key={columnName} name={columnName} />
                      );
                      break;
                    case 'jsonEditor':
                      result = (
                        <Textarea
                          autosize
                          minRows={7}
                          key={columnName}
                          label={title}
                          className="w-full"
                          error={errorMessage}
                          {...register(columnName)}
                        />
                      );
                      break;
                  }

                  break;
              }

              return result;
            })}
          </div>
        ) : null
      )}
    </>
  );
};

export default FieldMapper;
