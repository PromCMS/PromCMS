import { SystemSettings } from '@components/pages/Settings/MainPage';
import { NextPage } from '@custom-types';
import { ProfileLayout } from '@layouts';

const UserProfileMainPage: NextPage = () => {
  return (
    <ProfileLayout>
      <SystemSettings />
    </ProfileLayout>
  );
};

export default UserProfileMainPage;
