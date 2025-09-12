// src/components/EventCard/EventCard.jsx
import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt } from 'react-icons/fa';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { useModal } from '../../contexts/ModalContext';
import './EventCard.css';

const EventCard = ({ event }) => {
  const { openModal } = useModal();
  
  const handleOpenModal = (e) => {
    // Prevent default button behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    openModal(event);
  };
  
  return (
    <div className="event-card">
      {/* If the backend returns an image field: */}
      {event.image && (
        <div className="event-card__image-container">
          <img className="event-card__image" src={event.image} alt={event.event_name} />
        </div>
      )}
      <div className="event-card__content">
        <h3 className="event-card__title">{event.event_name}</h3>
        
        <div className="event-card__meta">
          <div className="event-card__meta-item">
            <FaCalendarAlt className="event-card__icon" />
            <span className="event-card__text">{formatDate(event.event_time)}</span>
          </div>
          
          <div className="event-card__meta-item">
            <FaClock className="event-card__icon" />
            <span className="event-card__text">{formatTime(event.event_time)}</span>
          </div>
          
          <div className="event-card__meta-item event-card__meta-item--location">
            <FaMapMarkerAlt className="event-card__icon" />
            <span className="event-card__text" title={event.location}>
              {event.location}
            </span>
          </div>
          
          {event.fee && (
            <div className="event-card__meta-item">
              <FaTicketAlt className="event-card__icon" />
              <span className="event-card__text">₹{event.fee}</span>
            </div>
          )}
        </div>
        
        <div className="event-card__description">
          <p className="event-card__description-text">{event.description}</p>
        </div>
        
        <button
          className="event-card__btn"
          onClick={handleOpenModal}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default EventCard;