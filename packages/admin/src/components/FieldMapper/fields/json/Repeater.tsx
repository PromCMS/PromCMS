import { MESSAGES } from '@constants';
import {
  ActionIcon,
  Button,
  Input,
  NumberInput,
  TextInput,
} from '@mantine/core';
import clsx from 'clsx';
import { FC, Fragment, useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Trash } from 'tabler-icons-react';

import { FieldPlacements, RepeaterAdminSchema } from '@prom-cms/schema';

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
  const { fields, remove, move, append } = useFieldArray({
    name: fieldName,
  });

  const hasLabels = useMemo(
    () => !!Array.from(columns.values()).find(({ title }) => !!title),
    [columns]
  );
  const allFields = useMemo(
    () => (fields.length ? fields : readonly ? [] : [{ id: 'default' }]),
    [fields, readonly]
  );

  return (
    <Input.Wrapper
      size="md"
      classNames={{
        label: 'flex w-full justify-between items-center',
      }}
      label={
        <>
          <span>{label}</span>
          <Button size="compact-sm" color="green" onClick={() => append({})}>
            {t(MESSAGES.ADD_ROW)}
          </Button>
        </>
      }
    >
      <div
        className={clsx([
          'mt-2 flex flex-col divide-y-2 divide-blue-100',
          placement === FieldPlacements.MAIN &&
            'rounded-lg border border-blue-200 bg-white dark:bg-transparent backdrop-blur-md p-2',
        ])}
      >
        {allFields.map((field, index) => (
          <div
            className={clsx(
              'flex w-full gap-2 first:pt-0 last:pb-0',
              hasLabels ? 'py-3' : 'py-3'
            )}
            key={field.id}
          >
            <div className="flex flex-col w-10 justify-end">
              <ActionIcon
                size="sm"
                disabled={index === 0}
                className="w-full max-h-[22px] min-h-[22px] rounded-b-none rounded-prom"
                variant="white"
                onClick={() => move(index, index - 1)}
              >
                <ChevronUp size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                disabled={allFields.length - 1 === index}
                className="w-full max-h-[22px] min-h-[22px] rounded-t-none rounded-prom"
                variant="white"
                onClick={() => move(index, index + 1)}
              >
                <ChevronDown size={16} />
              </ActionIcon>
            </div>
            {columns.map((columnInfo) => {
              let result = <></>;
              const columnFieldName = `${fieldName}.${index}.${columnInfo.name}`;
              const errorMessage = t(
                formState.errors[columnInfo.name]?.message || ''
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
                      {...columnInfo}
                      localized={false}
                    />
                  );
                  break;
              }

              return <Fragment key={columnInfo.name}>{result}</Fragment>;
            })}
            {!readonly ? (
              <Input.Wrapper
                label={hasLabels ? t('Actions') : undefined}
                labelProps={{ className: 'opacity-0' }}
                className="flex-none"
              >
                <div className="grid grid-cols-1">
                  {/* <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => insert(index + 1, {})}
                    disabled={disabled}
                  >
                    <Plus size={20} />
                  </ActionIcon> */}

                  <ActionIcon
                    disabled={index === 0 || disabled}
                    className={clsx(index == 0 && 'opacity-0')}
                    p="xs"
                    size="xl"
                    variant="subtle"
                    color="red"
                    onClick={() =>
                      confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT)) &&
                      remove(index)
                    }
                  >
                    <Trash />
                  </ActionIcon>
                </div>
              </Input.Wrapper>
            ) : null}
          </div>
        ))}
        {!allFields?.length ? <p>{t(MESSAGES.EMPTY_VALUE)}</p> : null}
      </div>
    </Input.Wrapper>
  );
};
