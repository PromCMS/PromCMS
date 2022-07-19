import UserUnderpages from '@components/pages/UserUnderPages';
import { PageLayout } from '@layouts';
import { NextPage } from '@custom-types';

const UserUnderPage: NextPage = () => {
  return (
    <PageLayout>
      <UserUnderpages.ContextProvider view="update">
        <UserUnderpages.Content />
      </UserUnderpages.ContextProvider>
    </PageLayout>
  );
};

export default UserUnderPage;
