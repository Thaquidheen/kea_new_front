import React from "react";
import "./ActivitiesTravels.css";
import heroImage from "../../../assets/alumini2.jpg";
import travel1 from "../../../assets/travel/10001.jpeg";
import travel2 from "../../../assets/travel/10002.jpeg";
import travel3 from "../../../assets/travel/10003.jpeg";
import travel4 from "../../../assets/travel/10004.jpeg";
import activity1 from "../../../assets/alumini2.jpg";
import activity2 from "../../../assets/alumini2.jpg";
import past1 from "../../../assets/alumini2.jpg";
import past2 from "../../../assets/alumini2.jpg";
import past3 from "../../../assets/alumini2.jpg";
import past4 from "../../../assets/alumini2.jpg";

const ActivitiesTravels = () => {
  return (
    <div className="kea-activities">
      {/* Hero Section */}
      <section className="kea-activities__hero">
        <img src={heroImage} alt="KEA Activities & Travels" className="kea-activities__hero-image" />
        <div className="kea-activities__hero-overlay">
          <h1 className="kea-activities__hero-title">KEA Activities & Travels</h1>
          <p className="kea-activities__hero-text">Explore, Connect, and Discover with Kerala Engineers' Association, Bengaluru.</p>
          <a href="/register" className="kea-activities__cta-btn">Join Us</a>
        </div>
      </section>

      {/* Activities Section */}
      <section className="kea-activities__section">
        <h2 className="kea-activities__section-title">Our Activities</h2>
        <div className="kea-activities__grid">
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Annual Day</h3>
            <p className="kea-activities__card-text">Celebrated every October/November, fostering camaraderie and networking.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">BBC Cricket Tournament</h3>
            <p className="kea-activities__card-text">The Beverage, Biriyani, and Cricket tournament unites alumni through sports.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Tech Talks</h3>
            <p className="kea-activities__card-text">Regular sessions featuring experts discussing the latest technological advancements.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Cultural Activities</h3>
            <p className="kea-activities__card-text">Encouraging members and families to participate in cultural and artistic events.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Educational Visits</h3>
            <p className="kea-activities__card-text">Visits to scientific and educational sites, including museums and research centers.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Open Tournaments</h3>
            <p className="kea-activities__card-text">Badminton and other sports tournaments open to all members.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Blood Donation Drives</h3>
            <p className="kea-activities__card-text">Organizing blood donation camps to support hospitals and emergency needs.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Philanthropic Support</h3>
            <p className="kea-activities__card-text">Supporting institutions like Sri Ramana Maharshi School for Blind and Reaching Hands.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Entrepreneurship Support</h3>
            <p className="kea-activities__card-text">Encouraging startups and business ventures through networking and mentorship.</p>
          </div>
          <div className="kea-activities__card">
            <h3 className="kea-activities__card-title">Employment Assistance</h3>
            <p className="kea-activities__card-text">Helping freshers and professionals with job placements and career growth.</p>
          </div>
        </div>
      </section>

      {/* Travel Section */}
      <section className="kea-activities__section kea-activities__section--travel">
        <h2 className="kea-activities__section-title">Travels</h2>
        <div className="kea-activities__travel-grid">
          <div className="kea-activities__travel-card">
            <img src={travel1} alt="Munnar Trekking" className="kea-activities__travel-image" />
            <h3 className="kea-activities__travel-title">Munnar Trekking</h3>
            <p className="kea-activities__travel-text">Experience the beauty of Kerala's mountains and tea plantations.</p>
          </div>
          <div className="kea-activities__travel-card">
            <img src={travel2} alt="Wayanad Wildlife Trip" className="kea-activities__travel-image" />
            <h3 className="kea-activities__travel-title">Wayanad Wildlife Trip</h3>
            <p className="kea-activities__travel-text">Explore Wayanad's stunning forests and waterfalls.</p>
          </div>
          <div className="kea-activities__travel-card">
            <img src={travel3} alt="Alleppey Backwaters" className="kea-activities__travel-image" />
            <h3 className="kea-activities__travel-title">Alleppey Backwaters</h3>
            <p className="kea-activities__travel-text">Enjoy a serene houseboat experience through the scenic backwaters.</p>
          </div>
          <div className="kea-activities__travel-card">
            <img src={travel4} alt="Kodaikanal Adventure" className="kea-activities__travel-image" />
            <h3 className="kea-activities__travel-title">Kodaikanal Adventure</h3>
            <p className="kea-activities__travel-text">Explore the beautiful hill station with breathtaking views.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ActivitiesTravels