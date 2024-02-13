import { Content } from '@components/editorialPage/Content';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';
import { Wrapper } from '@components/editorialPage/Wrapper';
import { EntryTypeUrlActionType } from '@custom-types';
import { PageLayout } from '@layouts/PageLayout';
import { FC } from 'react';

import { Aside, Header, Menu } from '.';
import {
  EntryUnderpageContextProvider,
  entryUnderpageContext,
} from '../-context';
import useCurrentModel from '../../-useCurrentModel';

export const EntryPageContent: FC<{ viewType: EntryTypeUrlActionType }> = ({
  viewType,
}) => {
  const model = useCurrentModel();

  return (
    <EntryUnderpageContextProvider viewType={viewType}>
      <entryUnderpageContext.Consumer>
        {({ onSubmit }) => (
          <form autoComplete="off" onSubmit={onSubmit}>
            <PageLayout rightAsideOutlet={<Aside />}>
              <Menu />
              <Wrapper>
                <Content>
                  <Header />
                  {/* We pass multiple refs */}
                  <DynamicFormFields modelInfo={model!} />
                </Content>
              </Wrapper>
            </PageLayout>
          </form>
        )}
      </entryUnderpageContext.Consumer>
    </EntryUnderpageContextProvider>
  );
};
