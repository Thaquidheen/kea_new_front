import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import { NotificationProvider } from './contexts/notificationReducer';
import NotificationContainer from './contexts/NotificationContainer';
import { NotificationProvider } from './contexts/NotificationContext';
import './contexts/notifications.css';
// import { NotificationProvider } from './contexts/NotificationReducer.js';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <NotificationProvider>
    <App />
          {/* <NotificationContainer /> */}
        </NotificationProvider>

  </React.StrictMode>
);

