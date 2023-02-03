import { Content } from '@components/editorialPage/Content';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';
import { Wrapper } from '@components/editorialPage/Wrapper';
import { Page } from '@custom-types';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import NotFoundPage from '@pages/404';
import { FC } from 'react';
import { Aside, Breadcrumbs, Header } from './components';
import { Footer } from './components/Footer';
import {
  SingletonPageContextProvider,
  useSingletonPageContext,
} from './context';
import { useCurrentSingletonData } from './useCurrentSingletonData';

const Fields: FC = () => {
  const singleton = useCurrentSingleton(true);
  const { data } = useCurrentSingletonData();
  const { formContentRefs } = useSingletonPageContext();

  return (
    <DynamicFormFields
      ref={formContentRefs}
      itemData={data}
      modelInfo={singleton}
    />
  );
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
