// src/components/events/EventDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EventDetailsPage() {
  const { eventId } = useParams(); // get the :eventId from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/events/${eventId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch event.");
        return res.json();
      })
      .then((data) => setEvent(data))
      .catch((err) => console.error(err));
  }, [eventId]);

  const handleRegister = () => {
    navigate(`/events/${eventId}/register`);
  };

  if (!event) {
    return <div>Loading event details...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{event.event_name}</h2>
      <p>
        <strong>Sub Name:</strong> {event.event_sub_name}
      </p>
      <p>
        <strong>Date/Time:</strong> {event.event_time}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      <p>
        <strong>Member Fee:</strong> {event.fee_for_member} |{" "}
        <strong>External Fee:</strong> {event.fee_for_external}
      </p>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default EventDetailsPage;
