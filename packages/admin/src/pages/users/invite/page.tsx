import { PageLayout } from '@layouts';
import { Page } from '@custom-types';
import { ContextProvider } from '../_context';
import { Content } from '../_components/Content';

const CreateUserPage: Page = () => {
  return (
    <PageLayout>
      <ContextProvider view="create">
        <Content />
      </ContextProvider>
    </PageLayout>
  );
};

export default CreateUserPage;
