import React from 'react'
import TripGallery from '../components/Travel/TripGallery/TripGallery'
import TripHeroSlider from '../components/Travel/TripHeroSlider/TripHeroSlider'
import MasonryGallery from '../components/Travel/MasonryGallery/MasonryGallery'



const Trips = () => {
  return (
    <div className="trips">
        <TripHeroSlider/>
<MasonryGallery/>
    </div>
  )
}

export default Trips