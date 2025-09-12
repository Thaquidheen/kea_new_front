import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../../api/EventsApi";
import { useModal } from "../../contexts/ModalContext";
import EventCard from "../EventCard/EventCard";
import EventModal from "../EventModal/EventModal";
import "./EventsSection.css";

const EventsSection = () => {
  const [allEvents, setAllEvents] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showModal, modalContent } = useModal();
  const navigate = useNavigate();

  // Custom SVG icons
  const icons = {
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="kea-events__icon">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
      </svg>
    ),
    arrow: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="kea-events__arrow-icon">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
      </svg>
    )
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Fetching events...');
        const eventsData = await getAllEvents();
        
        console.log('📨 API Response:', eventsData);
        console.log('📨 Response type:', typeof eventsData);
        console.log('📨 Is array:', Array.isArray(eventsData));
        
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
          console.warn('⚠️ Unexpected API response format:', eventsData);
          eventsList = [];
        }
        
        console.log(`✅ Processed ${eventsList.length} events successfully`);
        setAllEvents(eventsList);
        
      } catch (error) {
        console.error('❌ Error fetching events:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        setError(`Failed to load events: ${error.message}`);
        setAllEvents([]); // Ensure it's still an array
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const handleExploreAll = (e) => {
    e.preventDefault();
    navigate("/all-events");
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="kea-events">
        <div className="kea-events__container">
          <div className="kea-events__header">
            <div className="kea-events__header-left">
              <div className="kea-events__badge">All Events</div>
              <h2 className="kea-events__heading">Upcoming Events</h2>
            </div>
          </div>
          <div className="kea-events__loading">
            <div className="kea-events__spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if there was a problem
  if (error) {
    return (
      <section className="kea-events">
        <div className="kea-events__container">
          <div className="kea-events__header">
            <div className="kea-events__header-left">
              <div className="kea-events__badge">All Events</div>
              <h2 className="kea-events__heading">Upcoming Events</h2>
            </div>
          </div>
          <div className="kea-events__error">
            <p>Unable to load events. Please try again later.</p>
            <p><small>Error: {error}</small></p>
            <button 
              onClick={() => window.location.reload()} 
              className="kea-events__retry-btn"
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no events found
  if (!Array.isArray(allEvents) || allEvents.length === 0) {
    return (
      <section className="kea-events">
        <div className="kea-events__container">
          <div className="kea-events__header">
            <div className="kea-events__header-left">
              <div className="kea-events__badge">All Events</div>
              <h2 className="kea-events__heading">Upcoming Events</h2>
            </div>
          </div>
          <div className="kea-events__no-events">
            <p>No upcoming events at this time. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kea-events" id="events-section">
      <div className="kea-events__bg-shape"></div>
      
      <div className="kea-events__container">
        <div className="kea-events__header">
          <div className="kea-events__header-left">
            <div className="kea-events__badge">
              {icons.calendar} All Events ({allEvents.length})
            </div>
            <h2 className="kea-events__heading">Upcoming Events</h2>
          </div>
        </div>

        <div className="kea-events__grid">
          {allEvents.map((event) => (
            <EventCard key={event.event_id || event.id || Math.random()} event={event} />
          ))}
        </div>
      </div>

      {/* Render the event modal if showModal is true */}
      {showModal && <EventModal event={modalContent} />}
    </section>
  );
};

export default EventsSection;