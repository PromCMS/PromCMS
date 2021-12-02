import React from 'react';
import ReactDOM from 'react-dom';
import '@styles/index.css';
import SiteLayout from './layouts/SiteLayout/SiteLayout';
import Routes from './components/Routes';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteLayout>
        <Routes />
      </SiteLayout>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('admin-root')
);
