import { useEffect } from "react";
import "./MissionVisionHistory.css";
import missionImg from "../../../assets/mainimage.webp";
import visionImg from "../../../assets/mainimage.webp";
import historyImg from "../../../assets/history.jpg";
import vision from "../../../assets/visions.jpg"

const MissionVisionHistory = () => {
  
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('kea-pillars__animate-in');
          observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Select all elements to animate
    const animatedElements = document.querySelectorAll('.kea-pillars__animate');
    animatedElements.forEach(el => observer.observe(el));
    
    // Cleanup on component unmount
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="kea-pillars">
      <div className="kea-pillars__container">
        {/* Decorative elements */}
        <div className="kea-pillars__shape kea-pillars__shape--circle"></div>
        <div className="kea-pillars__shape kea-pillars__shape--square"></div>
        <div className="kea-pillars__shape kea-pillars__shape--triangle"></div>
        
        <div className="kea-pillars__header kea-pillars__animate kea-pillars__animate--fade">
          <h2 className="kea-pillars__heading">Our Foundation</h2>
          <p className="kea-pillars__subheading">The principles that guide and define us</p>
        </div>

        {/* ---------- MISSION ---------- */}
        <div className="kea-pillars__card kea-pillars__animate kea-pillars__animate--slide-right">
          <div className="kea-pillars__content">
            <div className="kea-pillars__badge">01</div>
            <h2 className="kea-pillars__title">Our Mission</h2>
            <p className="kea-pillars__text">
              To unite, empower and celebrate engineers of Kerala origin living
              in Bengaluru by fostering professional excellence, lifelong
              friendship, and a shared commitment to serve society.
            </p>
            <ul className="kea-pillars__list">
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '100ms'}}>Connect alumni through vibrant networking forums</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '200ms'}}>Promote continuous learning & technical leadership</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '300ms'}}>Champion social-impact projects for the under-served</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '400ms'}}>Preserve Kerala's culture and values among members</li>
            </ul>
          </div>

          <div className="kea-pillars__media kea-pillars__animate kea-pillars__animate--scale">
            <div className="kea-pillars__image-wrapper">
              <img src={missionImg} alt="KEA Mission" className="kea-pillars__image" />
              <div className="kea-pillars__image-overlay"></div>
            </div>
            <div className="kea-pillars__accent kea-pillars__accent--mission"></div>
          </div>
        </div>

        {/* ---------- VISION ---------- */}
        <div className="kea-pillars__card kea-pillars__card--reverse kea-pillars__animate kea-pillars__animate--slide-left">
          <div className="kea-pillars__content">
            <div className="kea-pillars__badge">02</div>
            <h2 className="kea-pillars__title">Our Vision</h2>
            <p className="kea-pillars__text">
              To be the most respected professional fraternity of Keralite
              engineers outside Kerala, recognised for technical excellence,
              community service and a spirit of camaraderie.
            </p>
            <ul className="kea-pillars__list">
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '100ms'}}>Inspire innovation through seminars & tech summits</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '200ms'}}>Nurture future engineers via mentoring & scholarships</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '300ms'}}>Lead sustainable development initiatives in Karnataka & Kerala</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '400ms'}}>Build a global network of NRK engineers for collective progress</li>
            </ul>
          </div>

          <div className="kea-pillars__media kea-pillars__animate kea-pillars__animate--scale">
            <div className="kea-pillars__image-wrapper">
              <img src={vision} alt="KEA Vision" className="kea-pillars__image" />
              <div className="kea-pillars__image-overlay"></div>
            </div>
            <div className="kea-pillars__accent kea-pillars__accent--vision"></div>
          </div>
        </div>

        {/* ---------- HISTORY ---------- */}
        <div className="kea-pillars__card kea-pillars__animate kea-pillars__animate--slide-right">
          <div className="kea-pillars__content">
            <div className="kea-pillars__badge">03</div>
            <h2 className="kea-pillars__title">Our History</h2>
            <p className="kea-pillars__text">
              Born in 1992 as a small gathering of Kerala-educated engineers in
              Bengaluru, KEA has grown into a 1,500-strong association that
              hosts flagship tech conclaves, cultural festivals and impactful
              charity drives every year.
            </p>
            <ul className="kea-pillars__list">
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '100ms'}}>1992 – Inception by a handful of visionaries</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '200ms'}}>2000 – Registered society & first technical symposium</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '300ms'}}>2010 – Launch of KEA Charity Fund & scholarship program</li>
              <li className="kea-pillars__list-item kea-pillars__animate kea-pillars__animate--fade-up" style={{transitionDelay: '400ms'}}>Today – A thriving hub linking engineers across continents</li>
            </ul>
          </div>

          <div className="kea-pillars__media kea-pillars__animate kea-pillars__animate--scale">
            <div className="kea-pillars__image-wrapper">
              <img src={historyImg} alt="KEA History" className="kea-pillars__image" />
              <div className="kea-pillars__image-overlay"></div>
            </div>
            <div className="kea-pillars__accent kea-pillars__accent--history"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionHistory;

