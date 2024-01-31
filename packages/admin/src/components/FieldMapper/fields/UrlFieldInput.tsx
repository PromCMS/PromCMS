import { MESSAGES } from '@constants';
import { Input, Select, SelectProps } from '@mantine/core';
import clsx from 'clsx';
import { ChangeEventHandler, FC, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ColumnTypeUrl } from '@prom-cms/schema';

const PROTOCOL_SPLIT = '://';

export const UrlFieldInput: FC<
  { columnName: string; disabled?: boolean } & ColumnTypeUrl
> = ({
  allowedDomains,
  allowedProtocols: allowedProtocolsUnformatted,
  columnName,
  title,
  disabled,
}) => {
  const { field, fieldState } = useController<{ [x: string]: string | null }>({
    name: columnName,
  });
  const { t } = useTranslation();
  const allowedProtocols = useMemo(
    () =>
      allowedProtocolsUnformatted?.map(
        (protocol) => `${protocol}${PROTOCOL_SPLIT}`
      ),
    [allowedProtocolsUnformatted]
  );

  const hasAllowedDomains = allowedDomains?.length;
  const hasAllowedProtocols = allowedProtocols?.length;
  const { protocol, domain, pathname } = useMemo(() => {
    let protocol: string | undefined = undefined;
    let domain: string | undefined = undefined;
    let pathname = field.value;

    if (field.value?.includes(PROTOCOL_SPLIT)) {
      const [extractedProtocol] = field.value.split(PROTOCOL_SPLIT);

      protocol = `${extractedProtocol}${PROTOCOL_SPLIT}`;
      pathname = pathname?.replace(protocol, '') ?? null;
    }

    if (pathname && pathname.includes('/')) {
      const [extractedDomain] = pathname.split('/');

      if (extractedDomain.includes('.')) {
        domain = extractedDomain;
        pathname = pathname.replace(domain, '');
      }
    }

    return { protocol, domain, pathname };
  }, [field.value]);

  let fieldValue = pathname;

  if (!hasAllowedDomains && domain) {
    fieldValue = domain.concat(fieldValue ?? '');
  }

  if (!hasAllowedProtocols && protocol) {
    fieldValue = protocol.concat(fieldValue ?? '');
  }

  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      let nextValue = event.currentTarget.value;
      if (allowedDomains || allowedProtocols) {
        const parts = [protocol];

        if (allowedDomains) {
          parts.push(domain, nextValue);
        } else {
          parts.push(nextValue);
        }

        nextValue = parts.filter(Boolean).join('');
      }

      field.onChange(nextValue);
    },
    [field.onChange, protocol, domain, allowedDomains]
  );

  const handleProtocolChange = useCallback<
    NonNullable<SelectProps['onChange']>
  >(
    (nextProtocol) => {
      if (!nextProtocol) {
        return;
      }

      field.onChange([nextProtocol, domain, pathname].filter(Boolean).join(''));
    },
    [domain, pathname, field.onChange]
  );

  const handleDomainChange = useCallback<NonNullable<SelectProps['onChange']>>(
    (nextDomain) => {
      if (!nextDomain) {
        return;
      }

      field.onChange([protocol, nextDomain, pathname].filter(Boolean).join(''));
    },
    [fieldValue, field.onChange]
  );

  let inputPlaceholder = '/some-path';
  if (!hasAllowedDomains) {
    inputPlaceholder = 'www.google.com'.concat(inputPlaceholder);
  }

  if (!hasAllowedProtocols) {
    inputPlaceholder = 'https://'.concat(inputPlaceholder);
  }

  return (
    <Input.Wrapper size="md" label={title} error={fieldState.error?.message}>
      <div className="flex">
        {hasAllowedProtocols ? (
          <Select
            classNames={{
              input: 'rounded-r-none',
              wrapper: 'flex-none max-w-[140px]',
            }}
            value={protocol ?? null}
            title={protocol ?? t(MESSAGES.CHOOSE)}
            data={allowedProtocols}
            onBlur={field.onBlur}
            onChange={handleProtocolChange}
            placeholder={t(MESSAGES.CHOOSE)}
            disabled={disabled}
          />
        ) : null}
        {hasAllowedDomains ? (
          <Select
            classNames={{
              input: clsx(
                'rounded-r-none',
                allowedProtocols && 'rounded-l-none'
              ),
              wrapper: 'flex-none max-w-[200px]',
            }}
            value={domain ?? null}
            title={domain ?? t(MESSAGES.CHOOSE)}
            data={allowedDomains}
            onBlur={field.onBlur}
            onChange={handleDomainChange}
            placeholder={t(MESSAGES.CHOOSE)}
            disabled={disabled}
          />
        ) : null}
        <Input
          type={allowedDomains?.length ? 'text' : 'url'}
          placeholder={inputPlaceholder}
          // @ts-ignore
          value={fieldValue}
          classNames={{
            input:
              hasAllowedDomains || hasAllowedProtocols
                ? 'rounded-l-none'
                : undefined,
            wrapper: 'w-full',
          }}
          onBlur={field.onBlur}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
    </Input.Wrapper>
  );
};
