import { useModelItem } from '@hooks/useModelItem'
import { SiteLayout } from '@layouts'
import { Button, Divider, Drawer, Mark, Title, Tooltip } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import { FileService } from '@services'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { NextPage } from '../../../../types'
import FilesPage from '../../index'

const FilePage: NextPage = () => {
  const { t } = useTranslation()
  const { back, query } = useRouter()
  const clipboard = useClipboard()
  const { data, isLoading } = useModelItem('files', query.fileId as string)

  // TODO: Get base url from server settings
  const onCopyClick = () =>
    clipboard.copy(
      new URL(FileService.getApiRawUrl(data!.id), window.location.origin)
    )

  return (
    <Drawer
      size="xl"
      opened={true}
      onClose={back}
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
            gutter={5}
            placement="center"
            position="bottom"
            radius="xl"
            transition="slide-down"
            transitionDuration={200}
            opened={clipboard.copied}
          >
            <Button
              className="bg-blue-100"
              variant="light"
              rightIcon={<iconSet.ClipboardCheck className="h-5 w-5" />}
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
  )
}

FilePage.getLayout = function getLayout(page) {
  return (
    <SiteLayout>
      <FilesPage />
      {page}
    </SiteLayout>
  )
}

export default FilePage
