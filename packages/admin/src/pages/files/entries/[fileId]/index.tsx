import { useModelItem } from '@hooks/useModelItem';
import { Button, Divider, Drawer, Title, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { ClipboardCheck } from 'tabler-icons-react';
import { useTranslation } from 'react-i18next';
import { Page } from '@custom-types';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '@api';

const FilePage: Page = () => {
  const { t } = useTranslation();
  const { fileId } = useParams();
  const navigate = useNavigate();
  const clipboard = useClipboard();
  const { data, isLoading } = useModelItem('files', fileId as string);

  const onCopyClick = () =>
    clipboard.copy(apiClient.files.getAssetUrl(fileId!));

  return (
    <Drawer
      size="xl"
      opened={true}
      onClose={() => navigate(-1)}
      padding="xl"
      position="right"
      closeButtonLabel={t('Close')}
      title={
        <Title order={4}>
          {isLoading ? (
            t('Loading...')
          ) : (
            <>
              File info of &apos;
              <span className="text-blue-500">{data!.filename}</span>
              &apos;
            </>
          )}
        </Title>
      }
    >
      {!isLoading && data && (
        <>
          <Divider mb="lg" mt="sm" size="sm" />
          <Tooltip
            label={t('Link copied!')}
            position="bottom"
            radius="xl"
            transition="slide-down"
            transitionDuration={200}
            opened={clipboard.copied}
          >
            <Button
              className="bg-blue-100"
              variant="light"
              rightIcon={<ClipboardCheck className="h-5 w-5" />}
              radius="xl"
              size="md"
              styles={{
                root: { paddingRight: 15, height: 40 },
                rightIcon: { marginLeft: 15 },
              }}
              onClick={onCopyClick}
            >
              {t('Copy link to clipboard')}
            </Button>
          </Tooltip>
        </>
      )}
    </Drawer>
  );
};

export default FilePage;
