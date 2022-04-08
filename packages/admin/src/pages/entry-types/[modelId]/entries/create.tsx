import {
  EntryUnderpageContextProvider,
  Content,
} from '@components/pages/EntryUnderpage'
import useCurrentModel from '@hooks/useCurrentModel'
import NotFoundPage from '@pages/404'
import { PageLayout } from '@layouts'
import { NextPage } from '@custom-types'

const EntryUnderpage: NextPage = () => {
  const model = useCurrentModel()

  if (!model || model.name === 'users') return <NotFoundPage />

  return (
    <PageLayout>
      <EntryUnderpageContextProvider viewType="create">
        <Content />
      </EntryUnderpageContextProvider>
    </PageLayout>
  )
}

export default EntryUnderpage
