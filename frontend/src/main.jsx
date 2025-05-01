import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from "@material-tailwind/react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
    <ThemeProvider>
    <Provider store={store}>
      <AuthProvider >
        <App />
        <ToastContainer position="bottom-right"  />
        <Toaster
  position="bottom-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: 'white',
      border: '1px solid #60a5fa', // Blue border for normal toasts
      color: '#1e3a8a',            // Dark blue text
      padding: '12px 16px',
      fontWeight: 'bold',
    },
    success: {
      style: {
        background: 'white',
        border: '1px solid #4ade80', // Green border
        color: '#166534',            // Dark green text
      },
    },
    error: {
      style: {
        background: 'white',
        border: '1px solid #f87171', // Red border
        color: '#7f1d1d',            // Dark red text
      },
    },
  }}
/>

      </AuthProvider>
      </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
