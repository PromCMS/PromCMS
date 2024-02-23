import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { MESSAGES } from '@constants';
import {
  ActionIcon,
  Button,
  Checkbox,
  Input,
  NumberInput,
  Paper,
  TextInput,
  Textarea,
} from '@mantine/core';
import clsx from 'clsx';
import { FC, Fragment, useMemo } from 'react';
import { Controller, useFieldArray, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Trash } from 'tabler-icons-react';

import { FieldPlacements, RepeaterAdminSchema } from '@prom-cms/schema';

export const Repeater: FC<{
  name: string;
  label: string;
  columns: RepeaterAdminSchema['columns'];
  placement: FieldPlacements;
  disabled?: boolean;
  readonly?: boolean;
}> = ({ name, label, columns, placement, disabled, readonly }) => {
  const formState = useFormState();
  const { t } = useTranslation();
  const fieldName = `${name}.data`;
  const { fields, remove, move, append } = useFieldArray({
    name: fieldName,
  });
  const fieldError = formState.errors?.[name]?.data?.message;

  const hasLabels = useMemo(
    () => !!Array.from(columns.values()).find(({ title }) => !!title),
    [columns]
  );
  const allFields = fields?.length ? fields : [];

  return (
    <Input.Wrapper
      size="md"
      classNames={{
        label: 'flex w-full justify-between items-center',
      }}
      error={
        typeof (fieldError as any) === 'string'
          ? t(fieldError as any)
          : undefined
      }
      label={
        <>
          <span>{label}</span>
          {readonly ? null : (
            <Button size="compact-sm" color="green" onClick={() => append({})}>
              {t(MESSAGES.ADD_ROW)}
            </Button>
          )}
        </>
      }
    >
      <Paper
        className={clsx([
          'mt-2 flex flex-col divide-y divide-blue-200',
          placement === FieldPlacements.MAIN ? 'p-3' : 'p-1',
          fieldError ? 'mb-1 border-red-400' : '',
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
            {readonly ? null : (
              <div className="flex flex-col w-10 mt-6">
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
            )}
            {columns.map((columnInfo) => {
              let result = <></>;
              const columnFieldName = `${fieldName}.${index}.${columnInfo.name}`;
              const label =
                columnInfo.title ||
                (hasLabels ? t(`${name} label`) : undefined);
              const classNames = !columnInfo.title
                ? { label: 'opacity-0' }
                : undefined;

              switch (columnInfo.type) {
                case 'number':
                  result = (
                    <Controller
                      name={columnFieldName}
                      render={({
                        field: { onChange, name, onBlur, ref, value },
                        fieldState: { error },
                      }) => (
                        <NumberInput
                          ref={ref}
                          name={name}
                          onBlur={onBlur}
                          onChange={(value) => onChange(value)}
                          label={label}
                          autoComplete="off"
                          classNames={classNames}
                          error={t(error?.message ?? '')}
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
                    <Controller
                      name={columnFieldName}
                      render={({ field, fieldState: { error } }) => (
                        <TextInput
                          label={label}
                          type={'string'}
                          autoComplete="off"
                          error={t(error?.message ?? '')}
                          className="w-full"
                          classNames={classNames}
                          disabled={disabled}
                          {...field}
                        />
                      )}
                    />
                  );
                  break;

                case 'boolean':
                  result = (
                    <Controller
                      name={columnFieldName}
                      render={({ field, fieldState: { error } }) => (
                        <Input.Wrapper
                          classNames={classNames}
                          size="md"
                          label={label}
                          error={t(error?.message ?? '')}
                        >
                          <Checkbox
                            name={field.name}
                            checked={!!field.value}
                            size={'md'}
                            onChange={(event) =>
                              field.onChange(event.currentTarget.checked)
                            }
                            label={t(field.value ? MESSAGES.YES : MESSAGES.NO)}
                            className="mt-1"
                            disabled={disabled}
                          />
                        </Input.Wrapper>
                      )}
                    />
                  );
                  break;

                case 'longText':
                  result = (
                    <Controller
                      name={columnFieldName}
                      render={({ field, fieldState: { error } }) => (
                        <Textarea
                          autosize
                          minRows={9}
                          label={label}
                          className="w-full"
                          error={t(error?.message ?? '')}
                          disabled={disabled}
                          classNames={classNames}
                          {...field}
                        />
                      )}
                    />
                  );
                  break;
              }

              return <Fragment key={columnInfo.name}>{result}</Fragment>;
            })}
            {!readonly ? (
              <Input.Wrapper
                label={hasLabels ? t('Actions') : undefined}
                classNames={{ label: 'opacity-0' }}
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
                    disabled={disabled}
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
        {!allFields?.length ? <ItemsMissingMessage className="py-4" /> : null}
      </Paper>
    </Input.Wrapper>
  );
};
