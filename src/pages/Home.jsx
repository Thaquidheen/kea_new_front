import React from 'react'
import HeroSection from '../components/herosection/HeroSection'
import CourseSlider from '../components/CourseSlider/CourseSlider'
import AboutUsHome from '../components/AboutUsHome/AboutUsHome'
import EventsSection from '../components/events/EventsSection'
import GoalSection from '../components/GoalSection/GoalSection'
import CTASection from '../components/CTASection/CTASection'
import RegisterSection from '../components/RegisterSection'

const Home = () => {
  return (
    <div className="home">
      <RegisterSection/>
         <HeroSection />
         <EventsSection/>
         <GoalSection/>
         <CTASection/>
         
    </div>
  )
}

export default Home