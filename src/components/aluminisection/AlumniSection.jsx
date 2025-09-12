import React from "react";
import "./AlumniSection.css";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import mentor1 from "../../assets/alumini1.webp"; // Replace with actual images
import mentor2 from "../../assets/alumini2.jpg";
import mentor3 from "../../assets/alumini3.jpg";

const AlumniSection = () => {
  return (
    <section className="alumni-section">
      <div className="alumni-container">
        {/* Left Side - Mentor Cards */}
        <div className="mentors">
          <div className="mentor-card">
            <img src={mentor1} alt="Adam Smith" className="mentor-img" />
            <div className="mentor-info">
              <h3>Adam Smith</h3>
              <p>Digital Marketing</p>
              <div className="social-icons">
                <FaLinkedin className="icon" />
                <FaFacebook className="icon" />
                <FaTwitter className="icon" />
              </div>
              <a href="#" className="view-profile">View Profile →</a>
            </div>
          </div>
          <div className="mentors-right">
            <div className="mentor-mini">
              <img src={mentor2} alt="Mentor" className="mentor-img" />
            </div>
            <div className="mentor-mini">
              <img src={mentor3} alt="Mentor" className="mentor-img" />
            </div>
          </div>
        </div>

        {/* Right Side - Text Content */}
        <div className="alumni-text">
          <h2>Meet With Our Mentors</h2>
          <p>
            Connect with experienced alumni to grow your network. Gain
            insights, mentorship, and career opportunities by engaging with
            our alumni community.
          </p>
          <button className="view-all">View All Profiles</button>
        </div>
      </div>
    </section>
  );
};

export default AlumniSection;
    