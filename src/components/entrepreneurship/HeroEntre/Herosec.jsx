import React from "react";
import "./herosec.css";
import aboutImage from "../../../assets/aboutus.webp";
import { FaArrowUpRightDots } from "react-icons/fa6";

const Herosec = () => {
  return (
    <section className="kea-hero">
      <div className="kea-hero__container">
        <div className="kea-hero__content">
          <p className="kea-hero__breadcrumb">
            Home <span className="kea-hero__breadcrumb-separator">/</span> <span className="kea-hero__breadcrumb-active">Entrepreneurship</span>
          </p>
          <h2 className="kea-hero__title">Entrepreneurship</h2>
          <p className="kea-hero__description">
            The KEA Entrepreneurs and Experts Network (KEEN) was established to facilitate closer ties among its members to enhance business opportunities. The forum also serves as a platform to share best practices, nurture start ups and to develop new products.
          </p>
        </div>
        
        <div className="kea-hero__image-wrapper">
          <div className="kea-hero__image-container">
            <img src={aboutImage} alt="Team Collaboration" className="kea-hero__image" />
            <div className="kea-hero__image-overlay"></div>
          </div>
          <div className="kea-hero__accent-circle">
            <FaArrowUpRightDots className="kea-hero__accent-icon" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosec;