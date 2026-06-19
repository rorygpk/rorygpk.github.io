import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// By default or through .env we inject the Google Client ID
// The user will need to configure VITE_GOOGLE_CLIENT_ID if not present
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "123456789-proxyid.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
