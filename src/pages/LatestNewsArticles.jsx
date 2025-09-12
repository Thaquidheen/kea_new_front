import React from 'react'
import LatestNews from '../components/latestnews/LatestNews/LatestNews'
import LatestArticles from '../components/latestnews/LatestArticles/LatestArticles'
import LatestHero from '../components/latestnews/LatestHero/LatestHero'
import CTASection from '../components/CTASection/CTASection'

const LatestNewsArticles = () => {
  return (
    <div className="latestnews">
      <LatestHero/>
      <LatestNews/>
      <LatestArticles/>
     <CTASection/>
    </div>
  )
}

export default LatestNewsArticles