/* src/components/TopBar/TopBar.jsx */
import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import "./TopBar.css";

export default function TopBar() {
  const [hidden, setHidden] = useState(false);
  const [prevY,   setPrevY] = useState(window.scrollY);

  /* slide away on scroll-down, return on scroll-up */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > prevY && y > 80);   // 80 px tolerance
      setPrevY(y);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [prevY]);

  return (
    <div className={`topbar ${hidden ? "hide" : ""}`}>
      {/* ------------- row 1 ------------- */}
      <div className="tb-row">
        <FaEnvelope />
        <a href="mailto:keab.info@gmail.com">keab.info@gmail.com</a>
      </div>

      {/* ------------- row 2 ------------- */}
      <div className="tb-row">
        <FaPhoneAlt />
        <a href="tel:+919590719394">+91&nbsp;9590719394</a>
      </div>

      {/* ------------- row 3 ------------- */}
      <div className="tb-row social">
        <span className="follow">Follow&nbsp;Us</span>
        <a href="https://facebook.com"><FaFacebookF /></a>
        <a href="https://twitter.com"><FaTwitter /></a>
        <a href="https://linkedin.com"><FaLinkedin /></a>
        <a href="https://instagram.com"><FaInstagram /></a>
        <a href="https://youtube.com"><FaYoutube /></a>
      </div>
    </div>
  );
}
