import { Flag } from '@components/Flag';
import { MESSAGES, adminLanguages } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { ComboboxItem, Group, Select, SelectProps, Text } from '@mantine/core';
import { ComponentPropsWithoutRef, FC, forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash } from 'tabler-icons-react';

interface LanguageSelectProps extends Omit<SelectProps, 'data'> {
  disabledOptions?: string[];
}
interface ItemProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
}

const languageCodeToFlagCode = {
  en: 'gb',
  cs: 'cz',
};

const SelectItemComponent = forwardRef<HTMLDivElement, ItemProps>(
  function SelectItem({ label, value, ...others }: ItemProps, ref) {
    return (
      <div ref={ref} {...others}>
        <Group>
          <Flag
            width={18}
            countryCode={languageCodeToFlagCode[value] ?? value}
          />

          <div>
            <Text size="sm">{label}</Text>
          </div>
        </Group>
      </div>
    );
  }
);

export const LanguageSelect: FC<LanguageSelectProps> = ({
  value,
  disabled,
  disabledOptions,
  ...rest
}) => {
  const { t } = useTranslation();
  const settings = useSettings();

  const formattedLanguages = useMemo<ComboboxItem[] | undefined>(() => {
    if (!settings) {
      return undefined;
    }

    return settings.application?.i18n.languages.map((value) => {
      const isDisabled = disabledOptions?.includes(value);

      return {
        label: `${t(adminLanguages[value] ?? value)} ${
          isDisabled ? ` (${t(MESSAGES.DEFAULT)})` : ''
        }`,
        value,
        disabled: isDisabled,
      };
    });
  }, [settings, t]);

  return (
    <Select
      data={formattedLanguages || []}
      label={t(MESSAGES.LANGUAGE)}
      placeholder={t(MESSAGES.SELECT_PLACEHOLDER)}
      disabled={!settings || disabled}
      value={value}
      leftSection={
        <Flag
          width={18}
          countryCode={(value && languageCodeToFlagCode[value]) || value}
          placeholder={<Hash size={18} />}
        />
      }
      {...rest}
    />
  );
};
