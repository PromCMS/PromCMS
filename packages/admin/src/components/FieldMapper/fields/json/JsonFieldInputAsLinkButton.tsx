import { MESSAGES } from '@constants';
import { Group, Input, Select, TextInput } from '@mantine/core';
import { FC, useMemo } from 'react';
import { useController } from 'react-hook-form';
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
  const { field: hrefField, fieldState: hrefFieldState } = useController({
    name: `${columnName}.href`,
  });
  const { field: labelField, fieldState: labelFieldState } = useController({
    name: `${columnName}.label`,
  });
  const { field: actionField, fieldState: actionFieldState } = useController({
    name: `${columnName}.action`,
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

  return (
    <Input.Wrapper size="md" label={title}>
      <div className="rounded-lg border-2 border-project-border bg-white p-3 text-left">
        <Group className="items-start" grow>
          <TextInput
            required={required}
            label={t('Link')}
            placeholder="https://google.com"
            error={hrefFieldState.error?.message}
            type="string"
            disabled={disabled}
            rightSection={
              hrefFieldState.error?.message ? (
                <Check size={16} color="green" />
              ) : (
                <Link size={16} />
              )
            }
            {...hrefField}
          />
          <TextInput
            label={t('Label')}
            placeholder={t(MESSAGES.SOME_TEXT)}
            rightSection={<AB size={16} />}
            error={labelFieldState.error?.message}
            disabled={disabled}
            {...labelField}
          />
        </Group>

        <Group className="mt-4 items-start" grow>
          <Select
            title={t(MESSAGES.ACTION_ON_CLICK)}
            name={actionField.name}
            value={actionField.value}
            onBlur={actionField.onBlur}
            data={actionsToLabelsAsSelectOptions}
            disabled={disabled}
            error={actionFieldState.error?.message}
            placeholder={t(MESSAGES.NO_ACTION)}
            allowDeselect
          />
        </Group>
      </div>
    </Input.Wrapper>
  );
};
