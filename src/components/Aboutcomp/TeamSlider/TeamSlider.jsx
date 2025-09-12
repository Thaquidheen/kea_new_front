import React from "react";
import "./TeamSlider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay"; // Import Autoplay
import { Navigation, Autoplay } from "swiper/modules"; // Import Autoplay Module
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import arjun from '../../../assets/team/arjun sundareshan_ president.jpeg'
import shameer from '../../../assets/team/shameer.jpg'
import betta from '../../../assets/team/betta_chandran__jointsecretery.jpeg'
import maitily from '../../../assets/team/Dr. mailtily k nair_ techinical activites secretery.jpeg'
import hafiya from '../../../assets/team/hafiya_vice president.png'
import hiran from '../../../assets/team/hiran_sprots secreteray.jpeg'
import pramod from '../../../assets/team/pramodK_cultural and art secretery.png'
import shinoj from '../../../assets/team/shinoj potuval _ GS.jpeg'
import tilak from '../../../assets/team/tilak raj _ social activity secretery.png'
import varun from '../../../assets/team/varunpp_tresherur.png'
import venugopal from '../../../assets/team/venugopalancv_patron.jpeg'


const teamMembers = [
  {
    id: 1,
    name: "Ahammed Shameer",
    position: "Social Media Secretary",
    image: shameer,
  },
  {
    id: 2,
    name: "Arjun Sundaresan",
    position: "President",
    image: arjun,
  },
  {
    id: 3,
    name: "Betta Chandran",
    position: "Joint Secretary",
    image: betta,
  },
  {
    id: 4,
    name: "Hafiya",
    position: "Vice President",
    image: hafiya,
  },
  {
    id: 5,
    name: "Mydhili K Nair",
    position: "Technical Activities Secretary",
    image: maitily,
  },{
    id: 6,
    name: "Hiran V M",
    position: "Sports Secretary",
    image: hiran,
  },{
    id: 7,
    name: "Pramod K",
    position: "Cultural/Arts Secretary",
    image: pramod,
  },{
    id: 8,
    name: "Shanoj Poduval",
    position: "General Secretary",
    image: shinoj,
  },{
    id: 9,
    name: "Tilak Raj",
    position: "Social Activities Secretary",
    image: tilak,
  },{
    id: 10,
    name: "Varun P P",
    position: "Treasurer",
    image: varun,
  },
  {
    id: 11,
    name: "Venugopalan C V",
    position: "Patron",
    image: venugopal,
  },
];

const TeamSlider = () => {
  return (
    <section className="team-section">
      <div className="team-container">
        <div className="team-header">
          <h2>Crafting Excellence as a Team</h2>
          <p>
            Our success is built on the dedication and expertise of our team, who work
            together to bring innovative ideas and exceptional craftsmanship to every project.
            Together, we turn visions into reality.
          </p>
    
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          navigation={true}
        //   loop={true}
       
          centeredSlidesBounds={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 2500, // Auto-scroll every 2.5 seconds
            disableOnInteraction: false, // Keep autoplay even after manual scroll
          }}
          // Ensure Swiper uses the Navigation & Autoplay modules
          modules={[Navigation, Autoplay]}
          className="team-slider"
        >
          {teamMembers.map((member) => (
            <SwiperSlide key={member.id} className="team-card">
              <div className="team-image-container">
                <img src={member.image} alt={member.name} className="team-image" />
                
              </div>
              <h3>{member.name}</h3>
              <p>{member.position}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TeamSlider;
