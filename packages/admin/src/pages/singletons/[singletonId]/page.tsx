import { Content } from '@components/editorialPage/Content';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';
import { Wrapper } from '@components/editorialPage/Wrapper';
import { Page } from '@custom-types';
import NotFoundPage from '@pages/404';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import { FC } from 'react';

import { Aside, Breadcrumbs, Header } from './components';
import { Footer } from './components/Footer';
import { SingletonPageContextProvider } from './context';

const Fields: FC = () => {
  const singleton = useCurrentSingleton(true);

  return <DynamicFormFields modelInfo={singleton} />;
};

const SingletonUnderpage: Page = ({}) => {
  const singleton = useCurrentSingleton();

  if (!singleton) return <NotFoundPage />;

  return (
    <SingletonPageContextProvider>
      <Wrapper>
        <Breadcrumbs />
        <Content>
          <Header />
          <Fields />
          <Footer />
        </Content>
      </Wrapper>
      <Aside />
    </SingletonPageContextProvider>
  );
};

export default SingletonUnderpage;
