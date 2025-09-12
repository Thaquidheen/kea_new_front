import React from "react";
import "./AboutSection.css";
import aboutImage from "../../../assets/aboutus.webp";
import { FaArrowUpRightDots } from "react-icons/fa6";

const AboutSection = () => {
  return (
    <section className="kea-about">
      <div className="kea-about__container">
        <div className="kea-about__content">
          <div className="kea-about__text-block">
            <div className="kea-about__nav">
              <p className="kea-about__nav-text">
                Home <span className="kea-about__nav-divider">/</span> <span className="kea-about__nav-current">About</span>
              </p>
            </div>
            
            <h2 className="kea-about__heading">
              Kerala Engineers' <span className="kea-about__heading-accent">Association</span>
            </h2>
            
            <div className="kea-about__text-wrapper">
              <p className="kea-about__paragraph">
                Kerala Engineers' Association (KEA), Bengaluru is an alumni confederation bringing together all Engineers in Bengaluru who have graduated from various engineering colleges in Kerala as well as NRK engineers from other colleges anywhere else.
              </p>
              
              {/* <a href="#more-about" className="kea-about__link">
                <span>Learn more about us</span>
                <FaArrowUpRightDots className="kea-about__link-icon" />
              </a> */}
            </div>
          </div>
          
          <div className="kea-about__media">
            <div className="kea-about__media-backdrop"></div>
            <div className="kea-about__media-frame">
              <img src={aboutImage} alt="Kerala Engineers' Association" className="kea-about__media-image" />
              <div className="kea-about__media-overlay">
                {/* <div className="kea-about__stat">
                  <span className="kea-about__stat-value">500+</span>
                  <span className="kea-about__stat-label">Members</span>
                </div>
                <div className="kea-about__stat">
                  <span className="kea-about__stat-value">50+</span>
                  <span className="kea-about__stat-label">Events</span>
                </div> */}
              </div>
            </div>
            <div className="kea-about__media-accent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;