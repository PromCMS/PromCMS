import { UserRoles } from '@components/pages/Settings/UserRoles';
import { NextPage } from '@custom-types';
import { ProfileLayout } from '@layouts';

const UserRolesPage: NextPage = () => {
  return (
    <ProfileLayout>
      <UserRoles />
    </ProfileLayout>
  );
};

export default UserRolesPage;
