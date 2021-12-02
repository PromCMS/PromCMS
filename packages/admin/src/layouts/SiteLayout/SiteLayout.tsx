import { FC } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

const SiteLayout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default SiteLayout;
