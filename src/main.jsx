import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; 
import store from './store'; 

import App from './app.jsx';
import './index.css';

const rootElement = document.getElementById('app');

createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);