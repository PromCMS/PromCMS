import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('prom_cms_root')!).render(
  <>
    {/* @ts-ignore */}
    <BrowserRouter basename={APP_URL_PREFIX}>
      <App />
    </BrowserRouter>
  </>
);
