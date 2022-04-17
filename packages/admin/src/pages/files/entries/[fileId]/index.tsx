import SlideOver from '@components/SlideOver'
import { useModelItem } from '@hooks/useModelItem'
import { SiteLayout } from '@layouts'
import { Button, Tooltip } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import { FileService } from '@services'
import { useRouter } from 'next/router'
import { NextPage } from '../../../../types'
import FilesPage from '../../index'

const FilePage: NextPage = () => {
  const { back, query } = useRouter()
  const clipboard = useClipboard()
  const { data, isLoading } = useModelItem('files', query.fileId as string)

  return (
    <SlideOver size="small" isOpen={true} onRequestClose={back}>
      {!isLoading && data && (
        <>
          <Tooltip
            label="Link copied!"
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
              rightIcon={<iconSet.ClipboardCheckIcon className="h-5 w-5" />}
              radius="xl"
              size="md"
              styles={{
                root: { paddingRight: 14, height: 48 },
                rightIcon: { marginLeft: 22 },
              }}
              onClick={() => clipboard.copy(FileService.getApiRawUrl(data.id))}
            >
              Copy link to clipboard
            </Button>
          </Tooltip>
        </>
      )}
    </SlideOver>
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
