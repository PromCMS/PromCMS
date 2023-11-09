import { ActionIcon, clsx, Input, NumberInput, TextInput } from '@mantine/core';
import { FieldPlacements, RepeaterAdminSchema } from '@prom-cms/schema';
import { FC, Fragment, useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, Trash } from 'tabler-icons-react';
import { RelationshipItemSelect } from '../RelationshipItemSelect';

export const Repeater: FC<{
  name: string;
  label: string;
  columns: RepeaterAdminSchema['columns'];
  placement: FieldPlacements;
  disabled?: boolean;
  readonly?: boolean;
}> = ({ name, label, columns, placement, disabled, readonly }) => {
  const { formState, register } =
    useFormContext<Record<string, string | boolean | number>>();
  const { t } = useTranslation();
  const fieldName = `${name}.data`;
  const { fields, insert, remove } = useFieldArray({
    name: fieldName,
  });

  const hasLabels = useMemo(
    () => !!Array.from(columns.values()).find(({ title }) => !!title),
    [columns]
  );
  const allFields = useMemo(
    () => (fields.length ? fields : [{ id: 'default' }]),
    [fields]
  );
  const entriesArray = useMemo(() => Array.from(columns.entries()), [columns]);

  return (
    <Input.Wrapper size="md" label={label}>
      <div
        className={clsx([
          'mt-2 flex flex-col divide-y-2 divide-gray-100',
          placement === FieldPlacements.MAIN &&
            'rounded-lg border border-gray-200 bg-white p-5',
        ])}
      >
        {allFields.map((field, index) => (
          <div
            className={clsx(
              'flex w-full gap-3 first:pt-0 last:pb-0',
              hasLabels ? 'py-3' : 'py-5'
            )}
            key={field.id}
          >
            {entriesArray.map(([columnKey, columnInfo]) => {
              let result = <></>;
              const columnFieldName = `${fieldName}.${index}.${columnKey}`;
              const errorMessage = t(
                formState.errors[columnKey]?.message || ''
              );
              const label =
                columnInfo.title ||
                (hasLabels ? t(`${name} label`) : undefined);
              const labelProps = !columnInfo.title
                ? { className: 'opacity-0' }
                : undefined;

              switch (columnInfo.type) {
                case 'number':
                  result = (
                    <Controller
                      name={columnFieldName}
                      render={({
                        field: { onChange, name, onBlur, ref, value },
                      }) => (
                        <NumberInput
                          ref={ref}
                          name={name}
                          onBlur={onBlur}
                          onChange={(value) => onChange(value)}
                          label={label}
                          autoComplete="off"
                          labelProps={labelProps}
                          error={errorMessage}
                          value={value}
                          className="w-full"
                          disabled={disabled}
                        />
                      )}
                    />
                  );
                  break;
                case 'string':
                  result = (
                    <TextInput
                      label={label}
                      type={'string'}
                      autoComplete="off"
                      error={errorMessage}
                      className="w-full"
                      labelProps={labelProps}
                      disabled={disabled}
                      {...register(columnFieldName)}
                    />
                  );
                  break;

                case 'relationship':
                  result = (
                    <RelationshipItemSelect
                      error={errorMessage}
                      disabled={disabled}
                      admin={{
                        editor: { placement: FieldPlacements.MAIN, width: 12 },
                        isHidden: false,
                      }}
                      columnName={columnFieldName}
                      unique={false}
                      translations={false}
                      {...columnInfo}
                    />
                  );
                  break;
              }

              return <Fragment key={columnKey}>{result}</Fragment>;
            })}
            {readonly ? (
              <Input.Wrapper
                label={hasLabels ? t('Actions') : undefined}
                labelProps={{ className: 'opacity-0' }}
                className="flex-none"
              >
                <div className="grid grid-cols-2">
                  <ActionIcon
                    size="xl"
                    p="xs"
                    variant="subtle"
                    color="blue"
                    onClick={() => insert(index + 1, {})}
                    disabled={disabled}
                  >
                    <Plus />
                  </ActionIcon>

                  <ActionIcon
                    disabled={index === 0 || disabled}
                    className={clsx(index == 0 && 'opacity-0')}
                    size="xl"
                    p="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => remove(index)}
                  >
                    <Trash />
                  </ActionIcon>
                </div>
              </Input.Wrapper>
            ) : null}
          </div>
        ))}
      </div>
    </Input.Wrapper>
  );
};
