import UserUnderpages from '@components/pages/UserUnderPages';
import { Page } from '@custom-types';
import { PageLayout } from '@layouts';

const UserUnderPage: Page = () => {
  return (
    <PageLayout>
      <UserUnderpages.ContextProvider view="update">
        <UserUnderpages.Content />
      </UserUnderpages.ContextProvider>
    </PageLayout>
  );
};

export default UserUnderPage;
