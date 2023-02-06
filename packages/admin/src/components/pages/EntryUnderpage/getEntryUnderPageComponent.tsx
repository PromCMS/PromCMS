import {
  EntryUnderpageContextProvider,
  Footer,
  entryUnderpageContext,
} from '@components/pages/EntryUnderpage';
import useCurrentModel from '@hooks/useCurrentModel';
import NotFoundPage from '@pages/404';
import { EntryTypeUrlActionType, Page } from '@custom-types';
import { Aside, Header } from '@components/pages/EntryUnderpage';
import { Wrapper } from '@components/editorialPage/Wrapper';
import { Content } from '@components/editorialPage/Content';
import { Breadcrumbs } from './Breadcrumbs';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';

export const getEntryUnderPageComponent = (
  viewType: EntryTypeUrlActionType
) => {
  const Component: Page = () => {
    const model = useCurrentModel();

    if (!model || model.name === 'users') return <NotFoundPage />;

    return (
      <EntryUnderpageContextProvider viewType={viewType}>
        <entryUnderpageContext.Consumer>
          {({ onSubmit }) => (
            <form autoComplete="off" onSubmit={onSubmit} className="flex">
              <Wrapper>
                <Breadcrumbs />
                <Content>
                  <Header />
                  {/* We pass multiple refs */}
                  <DynamicFormFields modelInfo={model} />
                  <Footer />
                </Content>
              </Wrapper>
              <Aside />
            </form>
          )}
        </entryUnderpageContext.Consumer>
      </EntryUnderpageContextProvider>
    );
  };

  return Component;
};
