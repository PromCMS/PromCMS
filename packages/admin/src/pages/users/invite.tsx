import UserUnderpages from '@components/pages/UserUnderPages';
import { PageLayout } from '@layouts';
import { Page } from '@custom-types';

const CreateUserPage: Page = () => {
  return (
    <PageLayout>
      <UserUnderpages.ContextProvider view="create">
        <UserUnderpages.Content />
      </UserUnderpages.ContextProvider>
    </PageLayout>
  );
};

export default CreateUserPage;
