import React from 'react'
import Herosec from '../components/entrepreneurship/HeroEntre/Herosec'
import EntrepreneurshipSlider from '../components/entrepreneurship/EntrepreneurshipSlider/EntrepreneurshipSlider'
import CTASection from '../components/CTASection/CTASection'

const Entrepreneurship = () => {
  return (
  <div className="entrepreneurship">
    <Herosec/>
    <EntrepreneurshipSlider/>
    <CTASection/>

  </div>
  )
}

export default Entrepreneurship