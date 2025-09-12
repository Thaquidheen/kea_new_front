import React from "react";
import "./HeroSection.css";
// Note: You'll need to ensure this path is correct in your project
import heroImage from "../../assets/mainimage.webp"; 
import hand from '../../assets/hands.jpg'

const HeroSection = () => {
  // Custom SVG icons
  const icons = {
    play: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="play-icon">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    building: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="card-icon">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
      </svg>
    ),
    people: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="card-icon">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    leaf: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="accent-icon">
        <path d="M6.05 4.14l-.39-.39c-.39-.39-1.02-.39-1.41 0l-.39.39c-.39.39-.39 1.02 0 1.41l.39.39c.39.39 1.02.39 1.41 0l.39-.39c.39-.38.39-1.02 0-1.41zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41 0l-.39.39c-.39.39-.39 1.02 0 1.41l.39.39c.39.39 1.02.39 1.41 0l.39-.39c.39-.38.39-1.02 0-1.41zm-1.81 15.1l.39.39c.39.39 1.02.39 1.41 0l.39-.39c.39-.39.39-1.02 0-1.41l-.39-.39c-.39-.39-1.02-.39-1.41 0l-.39.39c-.39.38-.39 1.02 0 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-.01 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-2.98 6.95H12c.56 0 1-.44 1-.99v-.96c0-.55-.44-.99-.99-.99H8.99c-.56-.01-1 .43-1 .98v.97c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39c.39-.39.39-1.02 0-1.41l-.39-.39c-.39-.39-1.02-.39-1.41 0l-.39.39c-.39.38-.39 1.02 0 1.41z"/>
      </svg>
    )
  };
  
  return (
    <section className="hero-section">
      <div className="hero-background-pattern"></div>
      
      <div className="hero-container">
        {/* Left Section - Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span>About Us</span>
            {icons.leaf}
          </div>
          
          <h1 className="hero-title">
            Kerala Engineers' Association <span>Bengaluru</span>
          </h1>
          
          <div className="hero-description">
            <p>
              Kerala Engineers' Association (KEA), Bengaluru is an alumni confederation bringing together all Engineers 
              in Bengaluru who have graduated from various engineering colleges in Kerala as well as NRK engineers from 
              other colleges anywhere else.
            </p>
            <p className="hide-on-mobile">
              This is an elite group of professionals playing a significant role in nurturing the social, technical, economical, 
              physical aspirations of members. Association is active in providing help to the needy through the Social 
              responsibility wing. The organization was established in 1992.

              
            </p>
          </div>
          
          <div className="hero-actions">
           <a href="/register" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
  Join Now
</a>
            <a href="https://youtu.be/gMSc0V3Pw40" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              {icons.play} Watch Video
            </a>
          </div>
        </div>
        
        {/* Right Section - Image */}
        <div className="hero-visual">
          <div className="hero-image-container">
            <div className="image-frame"></div>
            <div className="responsive-image-wrapper">
              <img 
                src={hand}
                alt="Kerala Engineers Association"
                className="hero-image"
              />
            </div>
            <div className="image-accent"></div>
            
            {/* Stat cards with improved styling */}
            <div className="desktop-stat-cards">
              <div className="stat-card stat-established">
                <div className="stat-icon">{icons.building}</div>
                <div className="stat-content">
                  <span className="stat-label">Since</span>
                  <span className="stat-value">1992</span>
                </div>
              </div>
              
              <div className="stat-card stat-members">
                <div className="stat-icon">{icons.people}</div>
                <div className="stat-content">
                  <span className="stat-value">2000+</span>
                  <span className="stat-label">Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-only stat cards with improved styling */}
      <div className="mobile-stat-cards">
        <div className="stat-card">
          <div className="stat-icon">{icons.building}</div>
          <div className="stat-content">
            <span className="stat-label">Since</span>
            <span className="stat-value">1992</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">{icons.people}</div>
          <div className="stat-content">
            <span className="stat-value">2000+</span>
            <span className="stat-label">Members</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;