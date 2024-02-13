import { apiClient } from '@api';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { pageUrls } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { PageLayout } from '@layouts/PageLayout';
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Table,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  Link,
  Outlet,
  createLazyFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useGeneralTranslations } from 'hooks/useGeneralTranslations';
import { useRequestWithNotifications } from 'hooks/useRequestWithNotifications';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash } from 'tabler-icons-react';

import { TranslationsForLanguageRoute } from './index';

export const Route = createLazyFileRoute(
  '/_authorized/settings/translations/$lang/'
)({
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  const settings = useSettings();
  const navigate = useNavigate();
  const { lang } = useParams({
    from: TranslationsForLanguageRoute.id,
  });
  const reqWithNotification = useRequestWithNotifications();
  const [userIsUpdating, { open: setUserIsTyping, close: setUserIsNotTyping }] =
    useDisclosure(false);
  const [itemIsUpdating, setIsUpdating] = useState(false);
  const {
    data: originalData,
    isLoading,
    refetch,
  } = useGeneralTranslations(lang!, {
    refetchOnMount: !userIsUpdating,
    refetchOnWindowFocus: !userIsUpdating,
  });
  const [data, setData] = useState(originalData);

  const sortedTranslations = useMemo(
    () =>
      Object.entries(data || {}).sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB)
      ),
    [data]
  );

  const updateKey = useCallback(
    async (key: string, value: string) => {
      setData({
        ...(data || {}),
        [key]: value,
      } as Record<string, string>);
    },
    [data]
  );

  const onSaveItem = async (key: string) => {
    if (originalData?.[key] == data![key]) {
      return;
    }

    setIsUpdating(true);
    await reqWithNotification(
      {
        title: 'Saving',
        message: t('Saving, please wait...'),
        successMessage: t('Key translated!'),
      },
      async () => {
        await apiClient.generalTranslations.update(key, data![key], lang!);
        await refetch();
        setIsUpdating(false);
        setUserIsNotTyping();
      }
    );
  };

  useEffect(() => {
    setData(originalData);
  }, [originalData]);

  const onDeleteClick = useCallback(
    (id: string) => async () => {
      if (
        !confirm(t('Do you really want to delete this key for ALL languages?'))
      ) {
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
            await apiClient.generalTranslations.delete(id);
            await refetch();
          }
        );
      } catch {}
    },
    [t, refetch]
  );

  const ths = (
    <Table.Tr>
      <Table.Th>{t('Translation key')}</Table.Th>
      <Table.Th className="w-full max-w-[350px]">
        {t('Translation value')}
      </Table.Th>
      <Table.Th className="w-full max-w-[100px] opacity-0">Tools</Table.Th>
    </Table.Tr>
  );

  const rows = sortedTranslations.map(([key, value]) => (
    <Table.Tr key={key}>
      <Table.Td className="align-top">{key}</Table.Td>
      <Table.Td className="w-full max-w-[350px]">
        <Textarea
          onFocus={setUserIsTyping}
          onBlur={() => onSaveItem(key)}
          onChange={(e) => updateKey(key, e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSaveItem(key);
            }
          }}
          value={value}
          placeholder={key}
        />
      </Table.Td>
      <Table.Td className="w-full max-w-[100px] align-baseline">
        <ActionIcon onClick={onDeleteClick(key)} color="red" size="lg">
          <Trash size={20} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <PageLayout>
      <PageLayout.Header>
        <Group justify="space-between" mb="md" mt="md">
          <LanguageSelect
            label=""
            value={lang}
            disabledOptions={[settings.application?.i18n.default!]}
            onChange={(value) =>
              value &&
              navigate({ to: pageUrls.settings.translations(value).list })
            }
          />
          <Button
            to={pageUrls.settings.translations(lang!).create}
            color={'green'}
            leftSection={<Plus />}
            component={Link}
          >
            {t('Add new')}
          </Button>
        </Group>
      </PageLayout.Header>
      <PageLayout.Content>
        <LoadingOverlay
          visible={isLoading || itemIsUpdating}
          overlayProps={{ blur: 2 }}
        />

        <Table verticalSpacing="lg">
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
          <Table.Tfoot>{ths}</Table.Tfoot>
        </Table>
        <Outlet />
      </PageLayout.Content>
    </PageLayout>
  );
}
