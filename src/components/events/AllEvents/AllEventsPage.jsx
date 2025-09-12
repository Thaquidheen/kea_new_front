// src/pages/AllEventsPage/AllEventsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AllEventsPage.css";
import { useModal } from "../../../contexts/ModalContext";
import { getAllEvents } from "../../../api/EventsApi";
import EventCard from "../../EventCard/EventCard";
import EventModal from "../../EventModal/EventModal";

function AllEventsPage() {
  const [events, setEvents] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showModal, modalContent } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔄 AllEventsPage: Fetching events...');
        const eventsData = await getAllEvents();
        
        console.log('📨 AllEventsPage API Response:', eventsData);
        console.log('📨 AllEventsPage Response type:', typeof eventsData);
        console.log('📨 AllEventsPage Is array:', Array.isArray(eventsData));
        
        // Handle different API response formats
        let eventsList = [];
        
        if (Array.isArray(eventsData)) {
          // Direct array response
          eventsList = eventsData;
        } else if (eventsData && Array.isArray(eventsData.results)) {
          // Paginated response with results array
          eventsList = eventsData.results;
        } else if (eventsData && Array.isArray(eventsData.data)) {
          // Response with data array
          eventsList = eventsData.data;
        } else if (eventsData && Array.isArray(eventsData.events)) {
          // Response with events array
          eventsList = eventsData.events;
        } else {
          console.warn('⚠️ AllEventsPage: Unexpected API response format:', eventsData);
          eventsList = [];
        }
        
        console.log(`✅ AllEventsPage: Processed ${eventsList.length} events successfully`);
        setEvents(eventsList);
        
      } catch (err) {
        console.error('❌ AllEventsPage: Error fetching events:', err);
        console.error('❌ AllEventsPage: Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        
        setError(err.message || "Failed to load events. Please try again.");
        setEvents([]); // Ensure it's still an array
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
            <p>Unable to load events: {error}</p>
            <button 
              className="retry-button" 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
            <button 
              className="back-button" 
              onClick={() => navigate('/')}
              style={{
                marginTop: '10px',
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Go Back Home
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
        
        {/* Debug info (remove in production) */}
        <div style={{
          background: '#f8f9fa',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>Debug Info:</strong> Found {events.length} events | 
          Type: {typeof events} | 
          Is Array: {Array.isArray(events) ? 'Yes' : 'No'}
        </div>
        
        {!Array.isArray(events) || events.length === 0 ? (
          <div className="no-events">
            <p>No upcoming events at this moment.</p>
            <p>Check back soon for new events!</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event, index) => (
              <EventCard 
                key={event.event_id || event.id || index} 
                event={event} 
              />
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