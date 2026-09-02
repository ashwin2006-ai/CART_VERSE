import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import './styles/design-system.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShopProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ShopProvider>
  </React.StrictMode>
);
