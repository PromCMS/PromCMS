import NotFoundPage from '@pages/404';
import EntryTypesListPage from '@pages/entry-types';
import EntryTypeUnderpage from '@pages/entry-types/[entryTypeId]';
import EntryTypeItemsListPage from '@pages/entry-types/[entryTypeId]/items';
import EntryTypeItemsListUnderPage from '@pages/entry-types/[entryTypeId]/items/[itemId]';
import FrontPage from '@pages/index';
import { VFC } from 'react';
import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';

const Routes: VFC = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<FrontPage />} />
      <Route path="entry-types">
        <Route index element={<EntryTypesListPage />} />
        <Route path=":entryType" element={<EntryTypeUnderpage />}>
          <Route path="items">
            <Route index element={<EntryTypeItemsListPage />} />
            <Route path=":itemId">
              <Route index element={<EntryTypeItemsListUnderPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </ReactRouterRoutes>
  );
};

export default Routes;
