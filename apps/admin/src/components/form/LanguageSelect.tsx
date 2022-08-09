import { useSettings } from '@hooks/useSettings';
import { Group, Select, SelectItem, SelectProps, Text } from '@mantine/core';
import { ComponentPropsWithoutRef, FC, forwardRef, useMemo } from 'react';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import { Hash } from 'tabler-icons-react';

interface LanguageSelectProps extends Omit<SelectProps, 'data'> {}
interface ItemProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
}
const languageTitles = {
  cs: 'Czech',
  en: 'English',
  fr: 'Francais',
  de: 'German',
};
const languageCodeToFlagCode = {
  en: 'gb',
  cs: 'cz',
};

const SelectItemComponent = forwardRef<HTMLDivElement, ItemProps>(
  function SelectItem({ label, value, ...others }: ItemProps, ref) {
    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Flag width={18} code={languageCodeToFlagCode[value] ?? value} />

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
  ...rest
}) => {
  const { t } = useTranslation();
  const settings = useSettings();

  const formattedLanguages = useMemo<SelectItem[] | undefined>(() => {
    if (!settings) {
      return undefined;
    }

    return settings.i18n.languages.map((value) => ({
      label: t(languageTitles[value] ?? value),
      value,
    }));
  }, [settings, t]);

  return (
    <Select
      data={formattedLanguages || []}
      label={t('Language')}
      placeholder={t('Select an option')}
      shadow="xl"
      disabled={!settings || disabled}
      itemComponent={SelectItemComponent}
      value={value}
      icon={
        <Flag
          width={18}
          code={(value && languageCodeToFlagCode[value]) || value}
          fallback={<Hash size={18} />}
        />
      }
      {...rest}
    />
  );
};
