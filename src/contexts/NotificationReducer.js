import React, { useReducer } from 'react';

// Create a simpler Context specifically for your existing code structure
const NotificationContext = React.createContext();

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Initial state
const initialState = {
  notifications: []
};

// Reducer for managing notifications
function NotificationReducer(state, action) {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            message: action.payload.message,
            type: action.payload.type,
            duration: action.payload.duration || 5000
          }
        ]
      };
      
    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    default:
      return state;
  }
}

// Actions
export function showNotification(dispatch, message, type, duration = 5000) {
  const id = Date.now();
  
  dispatch({
    type: 'SHOW_NOTIFICATION',
    payload: { message, type, duration, id }
  });
  
  if (duration > 0) {
    setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION', payload: id });
    }, duration);
  }
  
  return id;
}

// Helper actions for different types
export function showSuccess(dispatch, message, duration) {
  return showNotification(dispatch, message, NOTIFICATION_TYPES.SUCCESS, duration);
}

export function showError(dispatch, message, duration) {
  return showNotification(dispatch, message, NOTIFICATION_TYPES.ERROR, duration);
}

export function showInfo(dispatch, message, duration) {
  return showNotification(dispatch, message, NOTIFICATION_TYPES.INFO, duration);
}

export function showWarning(dispatch, message, duration) {
  return showNotification(dispatch, message, NOTIFICATION_TYPES.WARNING, duration);
}

// Provider component
export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(NotificationReducer, initialState);
  
  // Create an API object to expose to consumers
  const api = {
    state,
    dispatch,
    success: (message, duration) => showSuccess(dispatch, message, duration),
    error: (message, duration) => showError(dispatch, message, duration),
    info: (message, duration) => showInfo(dispatch, message, duration),
    warning: (message, duration) => showWarning(dispatch, message, duration)
  };
  
  return (
    <NotificationContext.Provider value={api}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use the notification context
export function useNotification() {
  const context = React.useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
}

const exports = {
  NotificationProvider,
  useNotification,
  NOTIFICATION_TYPES
};
export default exports;