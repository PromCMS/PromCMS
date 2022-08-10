import { LanguageSelect } from '@components/form/LanguageSelect';
import { Page } from '@custom-types';
import { useModelItems } from '@hooks/useModelItems';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import { useSettings } from '@hooks/useSettings';
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Pagination,
  Table,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ItemID } from '@prom-cms/shared';
import { EntryService } from '@services';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Plus, Trash } from 'tabler-icons-react';

export const GeneralTranslationsSettings: Page = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  const location = useLocation();
  const [language, setLanguage] = useState(settings?.i18n.default);
  const reqWithNotification = useRequestWithNotifications();
  const [userIsUpdating, { open: setUserIsTyping, close: setUserIsNotTyping }] =
    useDisclosure(false);
  const [itemIsUpdating, setIsUpdating] = useState(false);
  const {
    data: originalData,
    mutate,
    isLoading,
  } = useModelItems<{
    data: Record<string, string>;
  }>(
    'generalTranslations',
    {
      lang: language || 'en',
    },
    {
      revalidateIfStale: !userIsUpdating,
      revalidateOnFocus: !userIsUpdating,
      revalidateOnMount: !userIsUpdating,
    }
  );
  const [data, setData] = useState(originalData?.data);

  const updateKey = useCallback(
    async (key: string, value: string) => {
      setData({
        ...(data || {}),
        ...(value.length > 0 ? { [key]: value } : {}),
      } as Record<string, string>);
    },
    [data]
  );

  const onSaveItem = async (key: string) => {
    if (originalData?.data[key] == data![key]) {
      return;
    }

    setIsUpdating(true);
    await reqWithNotification(
      {
        title: 'Saving',
        message: t('Saving translation, please wait...'),
        successMessage: t('Key translated!'),
      },
      async () => {
        await EntryService.update(
          { id: key, model: 'generalTranslations', language },
          { value: data![key] }
        );
        await mutate();
        setIsUpdating(false);
        setUserIsNotTyping();
      }
    );
  };

  useEffect(() => {
    setData(originalData?.data);
  }, [originalData]);

  useEffect(() => {
    mutate();
  }, [location]);

  const onDeleteClick = useCallback(
    (id: ItemID) => async () => {
      if (!confirm(t('Do you really want to delete this key?'))) {
        return;
      }

      try {
        reqWithNotification(
          {
            title: 'Deleting',
            message: t('Deleting selected key, please wait...'),
            successMessage: t('Key deleted!'),
          },
          async () => {
            await EntryService.delete({
              id,
              model: 'generalTranslations',
            });
            await mutate();
          }
        );
      } catch {}
    },
    [t, mutate]
  );

  const ths = (
    <tr>
      <th>{t('Translation key')}</th>
      <th>{t('Translation value')}</th>
      <th className="w-[100px] opacity-0">Tools</th>
    </tr>
  );

  const rows = Object.entries(data || {}).map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>
        <TextInput
          onFocus={setUserIsTyping}
          onBlur={() => onSaveItem(key)}
          onChange={(e) => updateKey(key, e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSaveItem(key);
            }
          }}
          value={value}
        />
      </td>
      <td className="flex w-[100px]">
        <ActionIcon onClick={onDeleteClick(key)} color="red">
          <Trash />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <>
      <Group position="apart" mb="md" mt="md">
        <LanguageSelect
          label=""
          value={language}
          onChange={(value) => value && setLanguage(value)}
        />
        <Button
          to="/settings/translations/keys/create"
          color={'green'}
          leftIcon={<Plus />}
          component={Link}
        >
          {t('Add new')}
        </Button>
      </Group>
      <div className="relative min-h-[400px]">
        <LoadingOverlay visible={isLoading || itemIsUpdating} overlayBlur={2} />

        <Table className="-mx-5" horizontalSpacing="xl" verticalSpacing="sm">
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
          <tfoot>{ths}</tfoot>
        </Table>
      </div>
      <Outlet />
    </>
  );
};

export default GeneralTranslationsSettings;
