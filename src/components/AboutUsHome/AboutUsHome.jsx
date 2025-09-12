import React from "react";
import "./AboutUsHome.css";
import aboutImage from "../../assets/organization.jpg"; // Replace with actual image

const AboutUsHome = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Left Side - Text Content */}
        <div className="about-text">
          <span className="about-subheading">About Us</span>
          <h2>Our Dream is Global Learning Transformation</h2>
          <p>
            Kawuh was founded by Robert Anderson, a passionate lifelong learner,
            and Maria Sanchez, a visionary educator. Their shared dream was to
            create a digital haven of knowledge accessible to all. United by
            their belief in the transformational power of education, they
            embarked on a journey to build Kawuh.
          </p>
          <p>
            With relentless dedication, they gathered a team of experts and
            launched this innovative platform, creating a global community of
            eager learners, all connected by the desire to explore, learn, and
            grow.
          </p>
        </div>

        {/* Right Side - Image and Statistics Container */}
        <div className="about-right">
          <div className="about-image-container">
            <img src={aboutImage} alt="About Us" className="about-image" />
          </div>

          {/* Statistics Section */}
          <div className="about-stats">
            <div className="stat-box">
              <h3>3.5</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat-box">
              <h3>23</h3>
              <p>Project Challenge</p>
            </div>
            <div className="stat-box">
              <h3>830+</h3>
              <p>Positive Reviews</p>
            </div>
            <div className="stat-box">
              <h3>100K</h3>
              <p>Trusted Students</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHome;
