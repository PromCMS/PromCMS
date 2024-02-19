import { prepareFieldsForMapper } from '@components/FieldMapper';
import { AsideFields } from '@components/editorialPage/AsideFields';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import { Content } from '@components/editorialPage/Content';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';
import { Wrapper } from '@components/editorialPage/Wrapper';
import { EntryTypeUrlActionType } from '@custom-types';
import { PageLayout } from '@layouts/PageLayout';
import { FC, useMemo } from 'react';

import { ColumnType, FieldPlacements } from '@prom-cms/schema';

import {
  EntryUnderpageContextProvider,
  entryUnderpageContext,
} from '../-context';
import useCurrentModel from '../../-useCurrentModel';
import { CoeditorsEditor, PublishInfo } from './Aside/items';
import { Header } from './Header';
import { Menu } from './Menu';

export const EntryPageContent: FC<{ viewType: EntryTypeUrlActionType }> = ({
  viewType,
}) => {
  const model = useCurrentModel();

  const groupedAsideFields = useMemo<ColumnType[] | undefined>(() => {
    if (!model) return;

    return prepareFieldsForMapper(model, FieldPlacements.ASIDE);
  }, [model]);

  return (
    <EntryUnderpageContextProvider viewType={viewType}>
      <entryUnderpageContext.Consumer>
        {({ onSubmit }) => (
          <form autoComplete="off" onSubmit={onSubmit} className="h-full">
            <PageLayout
              rightAsideOutlet={
                model &&
                ((model?.timestamp && model?.ownable) ||
                  groupedAsideFields?.length ||
                  model?.sharable) ? (
                  <AsideWrapper isOpen>
                    {model?.timestamp && model?.ownable ? (
                      <PublishInfo />
                    ) : null}
                    {groupedAsideFields?.length ? (
                      <AsideFields model={model} />
                    ) : null}
                    {model?.sharable && <CoeditorsEditor />}
                  </AsideWrapper>
                ) : undefined
              }
            >
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
