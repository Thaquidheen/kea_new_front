import React from 'react'
import AboutSection from '../components/Aboutcomp/AboutSection/AboutSection'
import StatsSection from '../components/Aboutcomp/StatsSection/StatsSection'
import MissionVisionHistory from '../components/Aboutcomp/MissionVisionHistory/MissionVisionHistory'
import TeamSlider from '../components/Aboutcomp/TeamSlider/TeamSlider'
import CTASection from '../components/CTASection/CTASection'

const About = () => {
  return (
  <div className="about">
    <AboutSection/>
    {/* <StatsSection/> */}
    <MissionVisionHistory/>
    <TeamSlider/>
    <CTASection/>
    
  </div>
  )
}

export default About