// src/components/EventModal/EventModal.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt } from 'react-icons/fa';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { useModal } from '../../contexts/ModalContext';
import { checkEventRegistration, createEventPaymentOrder, completeEventRegistration, initiateEventPayment } from '../../api/EventsApi';
import './EventModal.css';
import { useNotification } from '../../contexts/NotificationContext';

const EventModal = ({ event }) => {
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const { success, error: showError, info } = useNotification();
  

  const handleRegister = async (e) => {
    // Prevent default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      showError('Please log in to register for this event.');
      closeModal();
      // Redirect to login page
      navigate('/login');
      return;
    }

    try {
      // Step 1: Check if user already registered
      const checkData = await checkEventRegistration(event.event_id);
    
      if (checkData.registered) {
        info(checkData.message); // Already registered message
        closeModal();
        return;
      }
    
      // Step 2: Create Razorpay order
      const orderData = await createEventPaymentOrder(event.event_id);
      
      // Step 3: Open Razorpay checkout
      // Get user data from local storage if available
      const userData = {};
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          userData.email = user.email;
          userData.name = user.username || user.fullName;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }

      initiateEventPayment(
        orderData,
        event,
        userData,
        // Success callback
        async (response) => {
          try {
            // Payment Success: Complete registration
            const registrationData = { 
              event: event.event_id,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature
            };
            
            await completeEventRegistration(registrationData);
            success('Registration successful and payment completed!');
            closeModal();
          } catch (error) {
            showError(error.message);
          }
        },
        // Error callback
        (errorMessage) => {
          showError('Payment failed: ' + errorMessage);
        }
      );
    } catch (error) {
      showError(error.message);
    }
  };

  if (!event) return null;

  return (
    <div className="event-modal__overlay active" onClick={() => closeModal()}>
      <div className="event-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="event-modal__close-btn" onClick={() => closeModal()}>×</button>
        
        <div className="event-modal__header">
          <h2 className="event-modal__title">{event.event_name}</h2>
        </div>
        
        <div className="event-modal__body">
          <div className="event-modal__details">
            <div className="event-modal__detail-item">
              <FaCalendarAlt className="event-modal__icon" />
              <span className="event-modal__text">{formatDate(event.event_time)}</span>
            </div>
            
            <div className="event-modal__detail-item">
              <FaClock className="event-modal__icon" />
              <span className="event-modal__text">{formatTime(event.event_time)}</span>
            </div>
            
            <div className="event-modal__detail-item">
              <FaMapMarkerAlt className="event-modal__icon" />
              <span className="event-modal__text">{event.location}</span>
            </div>
            
            {event.fee && (
              <div className="event-modal__detail-item">
                <FaTicketAlt className="event-modal__icon" />
                <span className="event-modal__text">₹{event.fee}</span>
              </div>
            )}
          </div>
          
          <div className="event-modal__section">
            <h3 className="event-modal__section-title">About this event</h3>
            <p className="event-modal__section-text">{event.description}</p>
          </div>
          
          {event.prerequisites && (
            <div className="event-modal__section">
              <h3 className="event-modal__section-title">Prerequisites</h3>
              <p className="event-modal__section-text">{event.prerequisites}</p>
            </div>
          )}
        </div>
        
        <div className="event-modal__footer">
          <button className="event-modal__btn event-modal__btn--secondary" onClick={() => closeModal()}>
            Cancel
          </button>
          <button className="event-modal__btn event-modal__btn--primary" onClick={handleRegister}>
            Confirm Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;