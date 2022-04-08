import { VFC } from 'react';

const NotFoundPage: VFC<{ text?: string }> = ({ text = 'Missing' }) => {
  return (
    <div className="flex min-h-screen">
      <div className="text-center m-auto">
        <h1 className="font-semibold text-6xl">404</h1>
        <hr className="border-t-8 w-1/4 mx-auto my-4 border-blue-100" />
        <p className="text-gray-500 text-xl">{text}</p>
      </div>
    </div>
  )
}

export default NotFoundPage;
