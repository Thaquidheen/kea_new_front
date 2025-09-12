// src/components/Notification/Notification.jsx
import React, { useEffect, useState } from 'react';
import './notifications.css'; // Import the fixed CSS

const NotificationContainer = ({ notifications, removeNotification }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onClose }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClose = () => {
    setIsRemoving(true);
    // Wait for animation to complete before actually removing
    setTimeout(() => {
      onClose();
    }, 500);
  };

  // Auto-remove after specified duration
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div 
      className={`notification notification-${notification.type} ${isRemoving ? 'removing' : ''}`}
    >
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-message">
          {notification.message}
        </div>
      </div>
      <button 
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default NotificationContainer;