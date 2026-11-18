import React from 'react';
import ReactDOM from 'react-dom/client';
import './convert.css';
import ConverterApp from './ConverterApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConverterApp />
  </React.StrictMode>
);

// Offline support (production only, so development never serves stale files).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/convert/sw.js', { scope: '/convert/' }).catch(() => {});
  });
}
