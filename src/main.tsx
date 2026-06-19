import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// By default or through .env we inject the Google Client ID
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const isDraftClient = !clientId || clientId.includes("proxyid");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId || "123456789-proxyid.apps.googleusercontent.com"}>
      <App />
      {isDraftClient && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white text-[10px] px-3 py-1 rounded-full shadow-2xl z-[9999] opacity-80 hover:opacity-100 transition-opacity flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>Google Client ID Missing - Use Settings to configure VITE_GOOGLE_CLIENT_ID</span>
        </div>
      )}
    </GoogleOAuthProvider>
  </StrictMode>,
);
