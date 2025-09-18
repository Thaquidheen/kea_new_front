// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BiCheckCircle, BiErrorCircle, BiInfoCircle, BiX } from 'react-icons/bi';

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Initial state
const initialState = [];

// Context Setup
const NotificationContext = createContext(null);

// Reducer for managing notifications
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [
        ...state,
        {
          id: action.payload.id,
          message: action.payload.message,
          type: action.payload.type,
          duration: action.payload.duration
        }
      ];
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    default:
      return state;
  }
};

// Individual Notification Component
const Notification = ({ notification, onClose }) => {
  const { id, message, type } = notification;

  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <BiCheckCircle size={20} />;
      case NOTIFICATION_TYPES.ERROR:
        return <BiErrorCircle size={20} />;
      case NOTIFICATION_TYPES.WARNING:
        return <BiInfoCircle size={20} />;
      case NOTIFICATION_TYPES.INFO:
      default:
        return <BiInfoCircle size={20} />;
    }
  };

  return (
    <div className={`notification notification-${type}`} data-notification-id={id}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-message">{message}</div>
      </div>
      <button className="notification-close" onClick={() => onClose(id)} aria-label="Close">
        <BiX size={20} />
      </button>
    </div>
  );
};

// Container for all Notifications
const NotificationContainer = ({ notifications, removeNotification }) => {
  if (!notifications.length) return null;

  return createPortal(
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>,
    document.body
  );
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, initialState);

  // Show a notification
  const showNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
    const id = Date.now() + Math.random(); // More unique ID
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id, message, type, duration }
    });

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, duration);
    }
    
    return id;
  }, []);

  // Helper methods for different notification types
  const success = useCallback((message, duration = 5000) => {
    console.log('SUCCESS notification called:', message);
    return showNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
  }, [showNotification]);
  
  const error = useCallback((message, duration = 5000) => {
    console.log('ERROR notification called:', message);
    return showNotification(message, NOTIFICATION_TYPES.ERROR, duration);
  }, [showNotification]);
  
  const info = useCallback((message, duration = 5000) => {
    console.log('INFO notification called:', message);
    return showNotification(message, NOTIFICATION_TYPES.INFO, duration);
  }, [showNotification]);
  
  const warning = useCallback((message, duration = 5000) => {
    console.log('WARNING notification called:', message);
    return showNotification(message, NOTIFICATION_TYPES.WARNING, duration);
  }, [showNotification]);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  // The value object that will be provided to consumers
  const value = {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    info,
    warning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Hook for using the notification system
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    console.error('useNotification must be used within a NotificationProvider');
    // Return safe fallback functions instead of throwing
    return {
      success: (msg) => console.log('SUCCESS (fallback):', msg),
      error: (msg) => console.error('ERROR (fallback):', msg),
      info: (msg) => console.log('INFO (fallback):', msg),
      warning: (msg) => console.warn('WARNING (fallback):', msg),
      notifications: [],
      showNotification: (msg) => console.log('NOTIFICATION (fallback):', msg),
      removeNotification: () => {}
    };
  }
  
  return context;
};