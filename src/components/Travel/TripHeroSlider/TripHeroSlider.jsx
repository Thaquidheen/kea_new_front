import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TripHeroSlider.css";
import munnar from '../../../assets/munnar.jpg'
import wagamon from '../../../assets/wagamon.jpg'

// Dummy Trip Data
const tripSlides = [
  {
    title: "Munnar",
    description:
      "Escape to Munnar, a hill station filled with sprawling tea plantations, misty valleys, and breathtaking viewpoints.",
    image:
    munnar, // Replace with actual image
  },
  {
    title: "Vagamon",
    description:
      "Vagamon offers rolling meadows, cool climate, and thrilling adventure activities like paragliding and trekking.",
    image:
    wagamon, // Replace with actual image
  },
  {
    title: "Wayanad",
    description:
      "Wayanad is a green paradise, known for its wildlife sanctuaries, dense forests, and breathtaking waterfalls.",
    image:
      "https://source.unsplash.com/1600x900/?wayanad,forest,nature", // Replace with actual image
  },
];

const TripHeroSlider = () => {
  return (
    <section className="trip-hero-section">
      <Swiper
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}

        modules={[Autoplay, Pagination, Navigation]}
        className="trip-hero-slider"
      >
        {tripSlides.map((trip, index) => (
          <SwiperSlide key={index} className="trip-slide">
            <div
              className="trip-slide-bg"
              style={{ backgroundImage: `url(${trip.image})` }}
            ></div>
            <div className="trip-slide-content">
              <h2>{trip.title}</h2>
              <p>{trip.description}</p>
              <button className="explore-btn">Explore {trip.title}</button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TripHeroSlider;
