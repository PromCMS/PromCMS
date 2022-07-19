import { VFC } from 'react';

const NotFoundPage: VFC<{ text?: string }> = ({ text = 'Missing' }) => {
  return (
    <div className="flex min-h-screen">
      <div className="m-auto text-center">
        <h1 className="text-6xl font-semibold">404</h1>
        <hr className="mx-auto my-4 w-1/4 border-t-8 border-blue-100" />
        <p className="text-xl text-gray-500">{text}</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
