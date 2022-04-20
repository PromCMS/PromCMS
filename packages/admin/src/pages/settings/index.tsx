import { SystemSettings } from '@components/pages/Settings/MainPage'
import { ProfileLayout } from '@components/pages/UserProfile'
import { NextPage } from '@custom-types'

const UserProfileMainPage: NextPage = () => {
  return (
    <ProfileLayout>
      <SystemSettings />
    </ProfileLayout>
  )
}

export default UserProfileMainPage
