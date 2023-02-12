import { Page } from '@custom-types';
import { PageLayout } from '@layouts';
import { Content } from '../_components/Content';
import { ContextProvider } from '../_context';

const UserUnderPage: Page = () => {
  return (
    <PageLayout>
      <ContextProvider view="update">
        <Content />
      </ContextProvider>
    </PageLayout>
  );
};

export default UserUnderPage;
