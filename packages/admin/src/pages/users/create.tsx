import UserUnderpages from '@components/pages/UserUnderPages'
import { PageLayout } from '@layouts'
import { NextPage } from '@custom-types'

const CreateUserPage: NextPage = () => {
  return (
    <PageLayout>
      <UserUnderpages.ContextProvider view="create">
        <UserUnderpages.Content />
      </UserUnderpages.ContextProvider>
    </PageLayout>
  )
}

export default CreateUserPage
