// src/components/events/EventRegistrationPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";


import "./EventRegistrationPage.css";
import { getEventById, registerForEventSimple } from "../../../api/EventsApi";
import { formatDate, formatTime } from "../../../utils/dateUtils";

function EventRegistrationPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);

  // Fetch event details when the component loads
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setEventLoading(true);
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Could not load event details. Please try again.");
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
      // Use the API function instead of direct fetch
      await registerForEventSimple(eventId);
      
      // Show success message and navigate
      alert("Successfully registered for the event!");
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register for event. Please try again.");
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
            <Link to={`/events/${eventId}`} className="cancel-button">
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