import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
        success: { style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' } },
        error: { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' } }
      }} />
    </BrowserRouter>
  </Provider>
);
