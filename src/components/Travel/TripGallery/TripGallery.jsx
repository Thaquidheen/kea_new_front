import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./TripGallery.css";
import munnar1 from "../../../assets/munnar.jpg"; 
import munnar2 from "../../../assets/munanr2.jpg";
// Dummy Data (Replace with actual media & reviews)
const tripData = [
  {
    name: "Munnar",
    summary:
      "One of the world wonders, the Antipope Canions in Arizona State of US. Formed about 20 billion years ago due to the tectonic movement of Collarado plate on to American peninsula and Collarado river...",
    images: [munnar1, munnar2, munnar1, munnar1, munnar1, munnar1],
    reviews: [
      { text: "Munnar was an amazing experience!", author: "Rahul, Kerala" },
      { text: "The tea plantations were breathtaking.", author: "Aditi, Bangalore" },
    ],
  },
  {
    name: "Vagamon",
    summary:
      "Vagamon is a picturesque hill station known for its rolling meadows, pine forests, and adventure sports like trekking and paragliding.",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    reviews: [
      { text: "The best paragliding experience I ever had!", author: "Nikhil, Delhi" },
      { text: "Peaceful and full of adventure, will visit again!", author: "Priya, Mumbai" },
    ],
  },
  // ... more trips ...
];

const TripGallery = () => {
  const [selectedTrip, setSelectedTrip] = useState(tripData[0]); // Default to first trip
  const [reviewIndex, setReviewIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(null); // For slideshow modal
  const tabRef = useRef(null);

  // Auto-scroll reviews every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % selectedTrip.reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedTrip]);

  // Open modal at the chosen image index
  const openModal = (index) => {
    setImageIndex(index);
  };

  // Close modal
  const closeModal = () => {
    setImageIndex(null);
  };

  // Navigate to previous image
  const prevImage = (e) => {
    e.stopPropagation();
    setImageIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? selectedTrip.images.length - 1 : newIndex;
    });
  };

  // Navigate to next image
  const nextImage = (e) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev + 1) % selectedTrip.images.length);
  };

  return (
    <section className="trip-gallery">
      {/* Scrollable Trip Tabs */}
      <div className="trip-tabs-container">
        <div className="trip-tabs" ref={tabRef}>
          {tripData.map((trip) => (
            <button
              key={trip.name}
              className={selectedTrip.name === trip.name ? "active" : ""}
              onClick={() => {
                setSelectedTrip(trip);
                setReviewIndex(0);
                setImageIndex(null);
              }}
            >
              {trip.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Summary */}
      {/* <div className="trip-summary">
        <h3>{selectedTrip.name}</h3>
        <p>{selectedTrip.summary}</p>
      </div> */}

      {/* Image Grid */}
      <div className="trip-images">
        {selectedTrip.images.map((img, index) => (
          <div
            key={index}
            className="image-container"
            onClick={() => openModal(index)}
          >
            <img src={img} alt={selectedTrip.name} className="trip-image" />
            <div className="overlay">{selectedTrip.name}</div>
          </div>
        ))}
      </div>

      {/* Slideshow Modal */}
      {imageIndex !== null && (
        <div className="lightbox-overlay" onClick={closeModal}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <button className="lightbox-prev" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            <img
              src={selectedTrip.images[imageIndex]}
              alt="slideshow"
              className="lightbox-image"
            />

            <button className="lightbox-next" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TripGallery;
