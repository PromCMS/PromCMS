import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

// @ts-ignore
let prefix = `${(APP_URL_PREFIX as string) || ''}`;

ReactDOM.createRoot(document.getElementById('prom_cms_root')!).render(
  <>
    <BrowserRouter basename={prefix}>
      <App />
    </BrowserRouter>
  </>
);
