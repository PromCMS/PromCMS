import { VFC } from 'react';
import { Outlet } from 'react-router';

const EntryTypeItemsListPage: VFC = ({}) => {
  return (
    <>
      Entry Type Underpage
      <Outlet />
    </>
  );
};

export default EntryTypeItemsListPage;
