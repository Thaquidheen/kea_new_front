import React from "react";
import "./EntrepreneurshipSlider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay } from "swiper/modules";
import { FaExternalLinkAlt } from "react-icons/fa";
import ggc from '../../../assets/ggs.jpeg'
import cip from '../../../assets/cip.jpg'

// Entrepreneurship Data
const companies = [
  {
    id: 1,
    name: "Graceful Growth Consulting (India) Pvt. Ltd.",
    description: "Enable organizations dramatically enhance their value to all its stakeholders with a philosophy of balanced growth & performance through sustainable innovations in the customer, finance, process & learning quadrants of its execution.",
    logo: ggc,
    website: "https://www.tesla.com",
  },
  {
    id: 2,
    name: "Cauvery Infra Projects",
    description: "Cauvery Infra Projects has a focused vision of providing clear titled, housing solutions in the form of plug and play plots with all government approvals, top of the line facilities and features at affordable prices to our esteemed buyers.",
    logo: cip,
    website: "http://www.cauveryinfraprojects.com/index.php",
  },
  {
    id: 3,
    name: "Amazon",
    description: "We cater to different industries like Metal cutting, PV, Manufacturing, assembly and Automotive. Our principle office is located at Veerasandra Industrial Estate, Electronic City phase-2, Bengaluru",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://www.amazon.com",
  },
  {
    id: 4,
    name: "SpaceX",
    description: "Solution architects and builders of cold chain infrastructure and clean pre - fab modular construction.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg",
    website: "https://www.spacex.com",
  },
];

const EntrepreneurshipSlider = () => {
  return (
    <section className="kea-slider">
      <div className="kea-slider__background">
        <div className="kea-slider__bg-circle kea-slider__bg-circle--1"></div>
        <div className="kea-slider__bg-circle kea-slider__bg-circle--2"></div>
        <div className="kea-slider__bg-pattern"></div>
      </div>
      
      <div className="kea-slider__container">
        <div className="kea-slider__header">
          <h2 className="kea-slider__title">Top Entrepreneurial Companies</h2>
          <div className="kea-slider__title-decoration"></div>
        </div>
        
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          centeredSlidesBounds={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'kea-slider__bullet',
            bulletActiveClass: 'kea-slider__bullet--active'
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Pagination, Autoplay]}
          className="kea-slider__swiper"
        >
          {companies.map((company) => (
            <SwiperSlide key={company.id} className="kea-slider__slide">
              <div className="kea-slider__card">
                <div className="kea-slider__logo-container">
                  <img src={company.logo} alt={company.name} className="kea-slider__logo" />
                </div>
                <div className="kea-slider__content">
                  <h3 className="kea-slider__company-name">{company.name}</h3>
                  <p className="kea-slider__description">{company.description}</p>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="kea-slider__btn">
                    Visit Website <FaExternalLinkAlt className="kea-slider__icon" />
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default EntrepreneurshipSlider;