import useCurrentModel from '@hooks/useCurrentModel';
import NotFoundPage from '@pages/404';
import { EntryTypeUrlActionType, Page } from '@custom-types';
import { Wrapper } from '@components/editorialPage/Wrapper';
import { Content } from '@components/editorialPage/Content';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';
import {
  EntryUnderpageContextProvider,
  entryUnderpageContext,
} from '../_context';
import { Aside, Footer, Header, Breadcrumbs } from '../_components';

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
