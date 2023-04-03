import { BlockEditor } from '@components/form/BlockEditor';
import { Checkbox, clsx, Input, Textarea, TextInput } from '@mantine/core';
import { ColumnType, FieldPlacements } from '@prom-cms/shared';
import { FC, Fragment } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnumSelect, RelationshipItemSelect } from './fields';
import { BigImage } from './fields/file/BigImage';
import { Normal } from './fields/file/Normal';
import { SmallImage } from './fields/file/SmallImage';
import { OpeningHours } from './fields/json/OpeningHours';
import { Repeater } from './fields/json/Repeater';

export interface FieldMapperProps {
  type: FieldPlacements;
  fields: (ColumnType & {
    columnName: string;
  })[][];
}

const FieldMapper: FC<FieldMapperProps> = ({ fields, type: placement }) => {
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
                      <div className="relative w-full">
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
                  result = <EnumSelect error={errorMessage} {...values} />;
                  break;

                case 'relationship':
                  result = (
                    <RelationshipItemSelect error={errorMessage} {...values} />
                  );
                  break;

                case 'file':
                  switch (values.admin.fieldType) {
                    case 'big-image':
                      result = (
                        <BigImage
                          name={columnName}
                          errorMessage={errorMessage}
                          label={values.title}
                          {...values}
                        />
                      );
                      break;
                    case 'small-image':
                      result = (
                        <SmallImage
                          name={columnName}
                          errorMessage={errorMessage}
                          label={values.title}
                          {...values}
                        />
                      );
                    case 'normal':
                      result = (
                        <Normal
                          name={columnName}
                          errorMessage={errorMessage}
                          label={values.title}
                          {...values}
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
                      result = <BlockEditor name={columnName} />;
                      break;
                    case 'openingHours':
                      result = (
                        <OpeningHours
                          label={title}
                          name={columnName}
                          placement={placement}
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
                        />
                      );
                      break;
                    case 'jsonEditor':
                      result = (
                        <Textarea
                          autosize
                          minRows={7}
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

              return <Fragment key={columnName}>{result}</Fragment>;
            })}
          </div>
        ) : null
      )}
    </>
  );
};

export default FieldMapper;
