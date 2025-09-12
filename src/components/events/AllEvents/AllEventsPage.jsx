// src/pages/AllEventsPage/AllEventsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AllEventsPage.css";
import { useModal } from "../../../contexts/ModalContext";
import { getAllEvents } from "../../../api/EventsApi";
import EventCard from "../../EventCard/EventCard";
import EventModal from "../../EventModal/EventModal";

function AllEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showModal, modalContent } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all events
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to load events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="events-page">
        <div className="events-container">
          <h1 className="page-title">KEA Events</h1>
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="events-container">
          <h1 className="page-title">KEA Events</h1>
          <div className="error-message">
            <p>Unable to load events. Please try again later.</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-container">
        <h1 className="page-title">KEA Events</h1>
        
        {events.length === 0 ? (
          <div className="no-events">
            <p>No upcoming events at this moment.</p>
            <p>Check back soon for new events!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        )}

        {/* Render the event modal if showModal is true */}
        {showModal && <EventModal event={modalContent} />}
      </div>
    </div>
  );
}

export default AllEventsPage;