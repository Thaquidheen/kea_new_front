import React from "react";
import "./RegisterSection.css";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaRunning,
  FaArrowRight 
} from "react-icons/fa";
import { RiGalleryFill } from "react-icons/ri";
import sampleImage from "../assets/KEAcolor.png";

const RegisterSection = () => {
  // Cards data for easy maintenance and scalability
  const cardsData = [
    {
      icon: <FaCalendarAlt className="card-icon" />,
      title: "Events",
      description: "Discover upcoming events and gatherings",
      link: "/all-events"
    },
    {
      icon: <RiGalleryFill className="card-icon" />,
      title: "Gallery",
      description: "View our collection of photos and videos",
      link: "/gallery"
    },
    {
      icon: <FaInfoCircle className="card-icon" />,
      title: "About",
      description: "Learn more about our organization",
      link: "/about"
    },
    {
      icon: <FaRunning className="card-icon" />,
      title: "Activities",
      description: "Explore our various activities and programs",
      link: "/activitiesandtravels"
    }
  ];

  return (
    <section className="register-section">
      <div className="register-overlay">
        <div className="register-container">
          <div className="register-header">
            <img 
              src={sampleImage} 
              alt="KEA Logo" 
              className="register-logo" 
            />
            <h2 className="register-title">Explore Our Services</h2>
            <div className="register-divider">
              <span></span>
            </div>
          </div>
          
          <div className="cards-grid">
            {cardsData.map((card, index) => (
              <div className="feature-card" key={index}>
                <div className="card-icon-wrapper">
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <a href={card.link} className="card-link">
                  <span>Learn More</span>
                  <FaArrowRight className="arrow-icon" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;