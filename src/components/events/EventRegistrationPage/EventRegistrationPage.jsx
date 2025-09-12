// src/components/events/EventRegistrationPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "./EventRegistrationPage.css";
import { getEventById, registerForEventSimple } from "../../../api/EventsApi";
import { formatDate, formatTime } from "../../../utils/dateUtils";
import { useNotification } from "../../../contexts/NotificationContext";

function EventRegistrationPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const { success, error: showError, info } = useNotification();

  // Fetch event details when the component loads
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setEventLoading(true);
        info('Loading event details...');
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        success('Event details loaded successfully');
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Could not load event details. Please try again.");
        showError("Could not load event details. Please try again.");
      } finally {
        setEventLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      info('Processing your registration...');
      // Use the API function instead of direct fetch
      await registerForEventSimple(eventId);
      
      // Show success message and navigate
      success("Successfully registered for the event!");
      info('Redirecting to event details...');
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register for event. Please try again.");
      showError(err.message || "Failed to register for event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (eventLoading) {
    return (
      <div className="event-registration-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event && !eventLoading) {
    // Show error notification for event not found
    showError("Event not found. Please check the event ID and try again.");
    return (
      <div className="event-registration-container">
        <div className="error-message">
          <h2>Event Not Found</h2>
          <p>We couldn't find the event you're looking for.</p>
          <Link to="/events" className="back-link">Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="event-registration-container">
      <div className="event-registration-card">
        <h2>Register for Event</h2>
        
        {event && (
          <div className="event-summary">
            <h3>{event.event_name}</h3>
            <p className="event-date">{formatDate(event.event_time)}</p>
            <p className="event-time">{formatTime(event.event_time)}</p>
            <p className="event-location">{event.location}</p>
            {event.fee > 0 ? (
              <p className="event-fee">Registration Fee: ₹{event.fee}</p>
            ) : (
              <p className="event-fee free">Free Entry</p>
            )}
          </div>
        )}
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="registration-form">
          {/* If you want to collect more info, add fields here */}
          <div className="form-actions">
            <Link 
              to={`/events/${eventId}`} 
              className="cancel-button"
              onClick={() => info('Registration cancelled')}
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventRegistrationPage;