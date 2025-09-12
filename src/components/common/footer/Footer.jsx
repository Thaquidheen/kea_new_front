import React from "react";
import "./footer.css";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram,
  FaYoutube,
  FaChevronRight,
  FaFacebook,
  FaFacebookSquare
} from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import logo from '../../../assets/KEAwhite.png';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: About KEA */}
            <div className="footer-col">
              <div className="footer-logo">
                <img src={logo} alt="Kerala Engineers Association" />
              </div>
              <p className="footer-about">
                Kerala Engineers Association is a professional community supporting engineers from Kerala
                with networking, professional development, and social engagement.
              </p>
              <div className="footer-social">
                <a href="https://www.facebook.com/keabengaluru/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <div className="social-icon-container">
                    <FaFacebookF />
                  </div>
                </a>
                <a href="https://x.com/KEABLR1" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <div className="social-icon-container">
                    <FaTwitter />
                  </div>
                </a>
                <a href="https://www.linkedin.com/groups/10314275/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <div className="social-icon-container">
                    <FaLinkedinIn />
                  </div>
                </a>
                <a href="https://www.instagram.com/keabinfo" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <div className="social-icon-container">
                    <FaInstagram />
                  </div>
                </a>
                <a href="https://www.youtube.com/channel/UCJosvwV5KPa1XHnczWWdEig" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <div className="social-icon-container">
                    <FaYoutube />
                  </div>
                </a>
                <a href="https://wa.me/9590719394" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <div className="social-icon-container">
                    <BsWhatsapp />
                  </div>
                </a>
              </div>
            </div>

            {/* Column 2: Contact Info */}
            <div className="footer-col">
              <h3>Contact Us</h3>
              <div className="footer-contact">
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <p>
                    Flat No. 002, Reyes Castillo,<br />
                    No.46, Hutchins Road. II Cross,<br />
                    Cooke Town, Bangalore 560084
                  </p>
                </div>
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <p>+91-9731206060</p>
                    <p>+91-9590719394</p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <p>keab.info@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Links */}
            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/"><FaChevronRight className="link-icon" /> Home</a></li>
                <li><a href="/about"><FaChevronRight className="link-icon" /> About Us</a></li>
                <li><a href="/all-events"><FaChevronRight className="link-icon" /> Events</a></li>
                <li><a href="/gallery"><FaChevronRight className="link-icon" /> Gallery</a></li>
                <li><a href="/entrepreneurship"><FaChevronRight className="link-icon" /> Entrepreneurship</a></li>
                <li><a href="/membership-card"><FaChevronRight className="link-icon" /> Membership Card</a></li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="footer-col">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li><a href="/newsandarticles"><FaChevronRight className="link-icon" /> News & Articles</a></li>
                <li><a href="/activitiesandtravels"><FaChevronRight className="link-icon" /> Activities & Travels</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>


      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Kerala Engineers Association. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;