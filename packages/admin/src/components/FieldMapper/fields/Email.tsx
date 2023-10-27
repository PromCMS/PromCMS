import { Input, Select, SelectProps } from '@mantine/core';
import { ColumnTypeEmail } from '@prom-cms/schema';
import { ChangeEventHandler, FC, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const Email: FC<
  { columnName: string; disabled?: boolean } & ColumnTypeEmail
> = ({ allowedDomains, columnName, title, disabled }) => {
  const { field, fieldState } = useController<{ [x: string]: string | null }>({
    name: columnName,
  });
  const { t } = useTranslation();
  const formattedAllowedDomains = useMemo(
    () => allowedDomains?.map((domain) => `@${domain}`),
    [allowedDomains]
  );
  const hasAllowedDomains = formattedAllowedDomains?.length;
  const valueSplitByAt = field.value?.split('@');

  const emailDomain = valueSplitByAt?.[1];
  const selectedDomain = emailDomain ? `@${emailDomain}` : null;
  const fieldValue =
    (hasAllowedDomains ? valueSplitByAt?.[0] : field.value) ?? undefined;

  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      let nextValue = event.currentTarget.value;

      if (allowedDomains) {
        nextValue = nextValue.concat(selectedDomain ?? '');
      }

      field.onChange(nextValue);
    },
    [field.onChange, field.value, selectedDomain, allowedDomains]
  );

  const handleDomainChange = useCallback<NonNullable<SelectProps['onChange']>>(
    (nextDomain) => {
      if (!nextDomain) {
        return;
      }

      field.onChange(fieldValue?.concat(nextDomain));
    },
    [fieldValue, field.onChange]
  );

  return (
    <Input.Wrapper size="md" label={title} error={fieldState.error?.message}>
      <div className="flex">
        <Input
          type={allowedDomains?.length ? 'text' : 'email'}
          placeholder={t(
            hasAllowedDomains ? 'john-doe' : 'john-doe@example.com'
          )}
          value={fieldValue}
          classNames={{
            input: hasAllowedDomains ? 'rounded-r-none' : undefined,
            wrapper: 'w-full',
          }}
          onBlur={field.onBlur}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {hasAllowedDomains ? (
          <Select
            classNames={{
              input: 'rounded-l-none',
              wrapper: 'flex-none max-w-[200px]',
            }}
            value={selectedDomain}
            title={selectedDomain ?? undefined}
            data={formattedAllowedDomains}
            onBlur={field.onBlur}
            onChange={handleDomainChange}
            disabled={disabled}
          />
        ) : null}
      </div>
    </Input.Wrapper>
  );
};
