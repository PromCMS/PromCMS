import { Content } from '@components/editorialPage/Content';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';
import { Wrapper } from '@components/editorialPage/Wrapper';
import { EntryTypeUrlActionType } from '@custom-types';
import NotFoundPage from '@pages/404';
import useCurrentModel from 'hooks/useCurrentModel';
import { FC } from 'react';

import { Aside, Breadcrumbs, Footer, Header } from '../_components';
import {
  EntryUnderpageContextProvider,
  entryUnderpageContext,
} from '../_context';

export const EntryPageContent: FC<{ viewType: EntryTypeUrlActionType }> = ({
  viewType,
}) => {
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
