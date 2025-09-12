import React from "react";
import "./CourseSlider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Import Swiper autoplay styles
import { Pagination, Autoplay } from "swiper/modules"; // Import Autoplay module
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import mentor1 from "../../assets/alumini1.webp"; // Replace with actual images
import mentor2 from "../../assets/alumini2.jpg";
import mentor3 from "../../assets/alumini3.jpg";

// Dummy Course Data
const courses = [
  {
    id: 1,
    title: "Workflow create UI Design",
    mentor: "Adam Smith",
    category: "Digital Marketing",
    mentorImg: "https://via.placeholder.com/50",
    image: mentor1,
  },
  {
    id: 2,
    title: "Fundamentals of UI Design",
    mentor: "John Doe",
    category: "UI/UX Designer",
    mentorImg: "https://via.placeholder.com/50",
    image: mentor2,
  },
  {
    id: 3,
    title: "5 Basic Programming CSS",
    mentor: "Taylor Swift",
    category: "Web Development",
    mentorImg: "https://via.placeholder.com/50",
    image: mentor3,
  },
  {
    id: 4,
    title: "Fundamentals of UI Design",
    mentor: "John Smith",
    category: "UI/UX Designer",
    mentorImg: "https://via.placeholder.com/50",
    image: mentor2,
  },
];

const CourseSlider = () => {
  return (
    <section className="course-section">
      <h2 className="course-heading">Our Popular Course</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000, // Auto slide every 3 seconds
          disableOnInteraction: false, // Keeps autoplay running even after manual swipe
        }}
        loop={true} // Infinite looping
        modules={[Pagination, Autoplay]}
        className="course-slider"
      >
        {courses.map((course) => (
          <SwiperSlide key={course.id} className="course-card">
            <div className="course-image-container">
              <img src={course.image} alt={course.title} className="course-image" />
            </div>
            <div className="course-info">
              <h3>{course.mentor}</h3>
              <p>{course.category}</p>
              <div className="social-icons">
                <FaLinkedin className="icon" />
                <FaFacebook className="icon" />
                <FaTwitter className="icon" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CourseSlider;
