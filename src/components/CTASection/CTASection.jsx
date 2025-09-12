import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CTASection.css";

const CTASection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for the token in localStorage
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // If user is logged in, don't render this section
  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="kea-cta">
      <div className="kea-cta__container">
        <h2 className="kea-cta__title">Register as a member of KEA Bengaluru</h2>
        <div className="kea-cta__buttons">
          <Link to="/register" className="kea-cta__btn kea-cta__btn--primary">Join Us</Link>
          {/* <Link to="/contact" className="kea-cta__btn kea-cta__btn--secondary">Contact us</Link> */}
        </div>
      </div>
    </section>
  );
};

export default CTASection;