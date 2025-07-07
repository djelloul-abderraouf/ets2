import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = "pk_test_Y2VudHJhbC1jdWItOTYuY2xlcmsuYWNjb3VudHMuZGV2JA"; // remplace par ta vraie clé Clerk

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ClerkProvider>
);
