
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { configureAxiosCSRF } from './utils/api';
import './index.css';

// Configure CSRF token handling for Django
configureAxiosCSRF().catch(error => {
  console.error('Failed to configure CSRF token:', error);
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
