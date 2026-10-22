import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// usa o mesmo SASS da versão sem React
import '../css/style/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
