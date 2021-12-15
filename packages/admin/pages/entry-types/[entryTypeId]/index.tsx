import { VFC } from 'react';
import { Outlet, useLocation, useParams } from 'react-router';

const EntryTypeUnderpage: VFC = ({}) => {
  const params = useParams();
  const { pathname } = useLocation();

  console.log({ params });

  return (
    <>
      <p className="text-green-800">Entry Type {pathname}</p>
      <Outlet />
    </>
  );
};

export default EntryTypeUnderpage;
