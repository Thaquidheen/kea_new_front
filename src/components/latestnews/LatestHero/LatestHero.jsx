import React from "react";


import aboutImage from "../../../assets/aboutus.webp"; // Replace with actual image
import { FaArrowUpRightDots } from "react-icons/fa6";

const LatestHero = () => {
  return (
    <section className="about-section">
      <div className="about-container">

        <div className="about-text">
          <p className="breadcrumb">
            [Home <span className="highlight">/ News & Articles</span>]
          </p>
          <h2 className="about-title">Kerala Engineers' 
          <br /> Association </h2>
          <p className="about-description">
          Kerala Engineers’ Association (KEA), Bengaluru is an alumni confederation bringing together all Engineers in Bengaluru who have graduated from various engineering colleges in Kerala as well as NRK engineers from other colleges anywhere else.

          </p>
        </div>

        {/* Right Side - Image with Rotating Icon */}
        <div className="about-image-containers">
          <img src={aboutImage} alt="Team Collaboration" className="about-image" />
     
        </div>
      </div>
    </section>
  );
};

export default LatestHero;
