import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';

// usa o mesmo SASS da versão sem React
import '../css/style/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* o BrowserRouter deixa o App ler e mudar a URL */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
