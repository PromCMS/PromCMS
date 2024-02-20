import { MESSAGES } from '@constants';
import { Group, Input, Select, SelectProps, TextInput } from '@mantine/core';
import clsx from 'clsx';
import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useCallback,
  useMemo,
} from 'react';
import { FieldError, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AB, Check, Link } from 'tabler-icons-react';

import { ColumnTypeJSON } from '@prom-cms/schema';

// TODO: move this into declaration of column inside prom-cms schema
const actionsToLabels = {
  download: MESSAGES.DOWNLOAD,
  'open-in-new-tab': MESSAGES.OPEN_IN_NEW_TAB,
};

export const JsonFieldInputAsLinkButton: FC<
  { columnName: string; disabled?: boolean } & ColumnTypeJSON
> = ({ columnName, disabled, required, title }) => {
  const { field, fieldState } = useController<
    Record<
      typeof columnName,
      { href?: string; label?: string; action?: string } | undefined
    >
  >({
    name: columnName,
  });

  const { t } = useTranslation();

  const actionsToLabelsAsSelectOptions = useMemo(
    () =>
      Object.entries(actionsToLabels).map(([value, label]) => ({
        value,
        label: t(label),
      })),
    [t]
  );

  const handleValuesChanged = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const { target } = event;
      const { value } = target;
      const name = target.name.replace(`${columnName}.`, '');

      let newFieldValue: typeof field.value | undefined = field.value ?? {};
      newFieldValue[name] = value;

      const newFieldValueAsObject = Object.entries(newFieldValue).filter(
        ([, value]) => !!value
      );
      newFieldValue = Object.fromEntries(newFieldValueAsObject) as any;

      if (!newFieldValueAsObject.length) {
        newFieldValue = undefined;
      }

      field.onChange(newFieldValue);
    },
    [field.onChange, field.value]
  );

  const handleActionChanged = useCallback<NonNullable<SelectProps['onChange']>>(
    (value) => {
      handleValuesChanged({
        target: {
          name: `${columnName}.action`,
          value: value,
        },
      } as ChangeEvent<HTMLInputElement>);
    },
    [handleValuesChanged]
  );

  const fieldErrors = fieldState.error as
    | undefined
    | (FieldError &
        Partial<Record<keyof NonNullable<typeof field.value>, FieldError>>);

  return (
    <Input.Wrapper size="md" label={title}>
      <div
        className={clsx(
          'rounded-lg border bg-white p-3 text-left',
          fieldErrors?.message ? 'border-red-400' : 'border-blue-100'
        )}
      >
        <Group className="items-start" grow>
          <TextInput
            required={required}
            label={t('Link')}
            placeholder="https://google.com"
            error={fieldErrors?.href?.message ?? fieldErrors?.message}
            type="string"
            disabled={disabled}
            rightSection={
              !fieldErrors?.href?.message && field.value?.href ? (
                <Check size={16} color="green" />
              ) : (
                <Link size={16} />
              )
            }
            value={field.value?.href}
            name={`${columnName}.href`}
            onChange={handleValuesChanged}
            onBlur={field.onBlur}
          />
          <TextInput
            name={`${columnName}.label`}
            label={t('Label')}
            placeholder={t(MESSAGES.SOME_TEXT)}
            rightSection={<AB size={16} />}
            onChange={handleValuesChanged}
            disabled={disabled}
            onBlur={field.onBlur}
            value={field.value?.label}
            error={fieldErrors?.label?.message}
          />
        </Group>

        <Group className="mt-4 items-start" grow>
          <Select
            allowDeselect
            name={`${columnName}.action`}
            title={t(MESSAGES.ACTION_ON_CLICK)}
            data={actionsToLabelsAsSelectOptions}
            disabled={disabled}
            onChange={handleActionChanged}
            onBlur={field.onBlur}
            placeholder={t(MESSAGES.NO_ACTION)}
            value={field.value?.action}
            error={fieldErrors?.action?.message}
          />
        </Group>
      </div>
    </Input.Wrapper>
  );
};
