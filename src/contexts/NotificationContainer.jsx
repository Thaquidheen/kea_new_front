import React, { useEffect } from 'react';
import { BiCheckCircle, BiErrorCircle, BiInfoCircle, BiX } from 'react-icons/bi';
import { createPortal } from 'react-dom';
import { NOTIFICATION_TYPES, useNotification } from './NotificationReducer';

// Notification Component
const Notification = ({ notification, onClose }) => {
  const { id, message, type } = notification;

  // Auto-close with animation when duration is reached
  useEffect(() => {
    const notificationElement = document.querySelector(`[data-notification-id="${id}"]`);
    if (notificationElement) {
      notificationElement.style.setProperty('--duration', notification.duration);
    }
  }, [id, notification.duration]);

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
    <div 
      className={`notification notification-${type}`} 
      data-notification-id={id}
    >
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-message">{message}</div>
      </div>
      <button 
        className="notification-close" 
        onClick={() => onClose(id)} 
        aria-label="Close"
      >
        <BiX size={20} />
      </button>
    </div>
  );
};

// Notification Container Component
const NotificationContainer = () => {
  const { state, dispatch } = useNotification();
  
  // Early return if no notifications
  if (!state.notifications.length) return null;
  
  const handleClose = (id) => {
    dispatch({ type: 'HIDE_NOTIFICATION', payload: id });
  };
  
  return createPortal(
    <div className="notification-container">
      {state.notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={handleClose}
        />
      ))}
    </div>,
    document.body
  );
};

export default NotificationContainer;