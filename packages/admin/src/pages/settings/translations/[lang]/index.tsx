import { apiClient } from '@api';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { pageUrls } from '@constants';
import { Page } from '@custom-types';
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Table,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useGeneralTranslations } from 'hooks/useGeneralTranslations';
import { useRequestWithNotifications } from 'hooks/useRequestWithNotifications';
import { useSettings } from 'hooks/useSettings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Plus, Trash } from 'tabler-icons-react';

export const GeneralTranslationsSettings: Page = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const settings = useSettings();
  const navigate = useNavigate();
  const { lang } = useParams();
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
        await apiClient.generalTranslations.updateTranslation(
          key,
          data![key],
          lang!
        );
        await refetch();
        setIsUpdating(false);
        setUserIsNotTyping();
      }
    );
  };

  useEffect(() => {
    setData(originalData);
  }, [originalData]);

  useEffect(() => {
    refetch();
  }, [location]);

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
            await apiClient.generalTranslations.deleteKey(id);
            await refetch();
          }
        );
      } catch {}
    },
    [t, refetch]
  );

  const ths = (
    <tr>
      <th>{t('Translation key')}</th>
      <th className="w-full max-w-[350px]">{t('Translation value')}</th>
      <th className="w-full max-w-[100px] opacity-0">Tools</th>
    </tr>
  );

  const rows = sortedTranslations.map(([key, value]) => (
    <tr key={key}>
      <td className="align-top">{key}</td>
      <td className="w-full max-w-[350px]">
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
      </td>
      <td className="w-full max-w-[100px]">
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
          value={lang}
          disabledOptions={[settings?.i18n.default!]}
          onChange={(value) =>
            value && navigate(pageUrls.settings.translations(value).list)
          }
        />
        <Button
          to={pageUrls.settings.translations(lang!).create}
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
