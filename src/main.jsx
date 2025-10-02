import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { PromoProvider } from './context/PromoContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PromoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PromoProvider>
  </StrictMode>
);
