import { Content } from '@components/editorialPage/Content';
import { DynamicFormFields } from '@components/editorialPage/DynamicFormFields';
import { Wrapper } from '@components/editorialPage/Wrapper';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { UnderpageLayout } from '@layouts/UnderpageLayout';
import { createLazyFileRoute } from '@tanstack/react-router';
import { FC } from 'react';

import { Aside, Header } from './-components';
import { Footer } from './-components/Footer';
import { SingletonPageContextProvider } from './-context';

export const Route = createLazyFileRoute(
  '/_authorized/entities/singletons/$singletonId/'
)({
  component: Page,
});

const Fields: FC = () => {
  const singleton = useCurrentSingleton(true);

  return <DynamicFormFields modelInfo={singleton} />;
};
function Page() {
  return (
    <SingletonPageContextProvider>
      <UnderpageLayout asideOutlet={<Aside />}>
        <Footer />
        <Wrapper>
          <Content>
            <Header />
            <Fields />
          </Content>
        </Wrapper>
      </UnderpageLayout>
    </SingletonPageContextProvider>
  );
}
