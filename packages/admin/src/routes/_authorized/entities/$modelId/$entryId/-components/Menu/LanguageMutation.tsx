import { Flag } from '@components/Flag';
import { MESSAGES } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import {
  ActionIcon,
  Button,
  ComboboxItem,
  Divider,
  Popover,
  Title,
  Tooltip,
} from '@mantine/core';
import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Check, World } from 'tabler-icons-react';

const languageTitles = {
  cs: 'Czech',
  en: 'English',
  fr: 'Francais',
  de: 'German',
};

export const LanguageMutation: FC<{
  language: string;
  onSelect: (language: string) => void;
}> = ({ language, onSelect }) => {
  const formState = useFormState();
  const { t } = useTranslation();
  const settings = useSettings();
  const [opened, setOpened] = useState(false);

  const onToggleOpen = () => setOpened((o) => !o);

  const formattedLanguages = useMemo<ComboboxItem[] | undefined>(() => {
    if (!settings) {
      return undefined;
    }

    return settings.application?.i18n.languages.map((value) => {
      let label = t(languageTitles[value] ?? value);

      if (value === settings.application?.i18n.default) {
        label += ` (${t('Default')})`;
      }

      return {
        label,
        value,
      };
    });
  }, [settings, t]);

  return (
    <Popover
      width={250}
      position="bottom-end"
      withArrow
      shadow="md"
      arrowPosition="center"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Tooltip
          withArrow
          label={t(MESSAGES.LOCALIZE)}
          position="bottom-end"
          arrowPosition="center"
          disabled={opened}
          color="gray"
        >
          <ActionIcon
            size="xl"
            type="button"
            loading={formState.isSubmitting}
            color="blue"
            variant="light"
            styles={{
              root: {
                width: 50,
                height: 50,
              },
            }}
            className={clsx(formState.isSubmitting && '!cursor-progress')}
            onClick={onToggleOpen}
          >
            {language === settings.application?.i18n.default || !language ? (
              <World className="aspect-square w-10" />
            ) : (
              <Flag countryCode={language} />
            )}
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown className="p-2">
        <Title order={5}>{t('Select language')}</Title>
        <Divider className="my-2" />
        <div className="flex flex-col gap-2">
          {formattedLanguages?.map((item) => (
            <Button
              rightSection={
                language === item.value ? (
                  <Check className="text-green-500" />
                ) : null
              }
              variant="white"
              onClick={() => {
                onSelect(item.value);
                onToggleOpen();
              }}
              classNames={{
                label: 'mr-auto',
              }}
              key={item.value}
            >
              <Flag countryCode={item.value} className="mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
