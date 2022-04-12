import SlideOver from '@components/SlideOver'
import { SiteLayout } from '@layouts'
import { useRouter } from 'next/router'
import { NextPage } from '../../../../types'
import FilesPage from '../../index'

const FilePage: NextPage = () => {
  const { back } = useRouter()

  return (
    <SlideOver size="small" isOpen={true} onRequestClose={back}>
      sdfdsf
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
