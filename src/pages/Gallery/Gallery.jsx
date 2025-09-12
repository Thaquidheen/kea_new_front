import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import newyear2020_1 from '../../assets/gallery/10005.jpg'
import workshop2020_1 from '../../assets/gallery/10006.jpg'
import workshop2020_2 from '../../assets/gallery/10007.jpg'
import football_1 from '../../assets/gallery/10001.jpg'
import football_2 from '../../assets/gallery/10002.jpg'
import football_3 from '../../assets/gallery/10003.jpg'
import football_4 from '../../assets/gallery/10004.jpg'
import cricket_1 from '../../assets/gallery/10041.jpg'
import cricket_2 from '../../assets/gallery/10042.jpg'
import annual_1 from '../../assets/gallery/10008.jpg'
import annual_2 from '../../assets/gallery/10009.jpg'
import annual_3 from '../../assets/gallery/10010.jpg'
import annual_4 from '../../assets/gallery/10011.jpg'
import annual_5 from '../../assets/gallery/10012.jpg'
import annual_6 from '../../assets/gallery/10013.jpg'
import annual_7 from '../../assets/gallery/10014.jpg'
import annual_8 from '../../assets/gallery/10015.jpg'
import annual_9 from '../../assets/gallery/10016.jpg'
import annual_10 from '../../assets/gallery/10017.jpg'
import annual_11 from '../../assets/gallery/10018.jpg'
import annual_12 from '../../assets/gallery/10019.jpg'
import annual_13 from '../../assets/gallery/10020.jpg'
import annual_14 from '../../assets/gallery/10021.jpg'
import annual_15 from '../../assets/gallery/10022.jpg'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './Gallery.css';

const Gallery = () => {
  // Define categories
  const categories = ['New Year 2020', 'Football Tournament 2020', 'Workshop 2020', 'KEA Annual Day', 'KEA Cricket Tournament'];

  // Example image data
  const images = [
    {
      id: 1,
      src: newyear2020_1,
      alt: 'Gallery Image 1',
      category: 'New Year 2020',
    },
    {
      id: 2,
      src: workshop2020_1,
      alt: 'Gallery Image 2',
      category: 'Workshop 2020',
    },
    {
      id: 3,
      src: workshop2020_2,
      alt: 'Gallery Image 3',
      category: 'Workshop 2020',
    },
    {
      id: 4,
      src: football_1,
      alt: 'Gallery Image 4',
      category: 'Football Tournament 2020',
    },
    {
      id: 5,
      src: football_2,
      alt: 'Gallery Image 5',
      category: 'Football Tournament 2020',
    },
    {
      id: 6,
      src: football_3,
      alt: 'Gallery Image 6',
      category: 'Football Tournament 2020',
    },
    {
      id: 7,
      src: football_4,
      alt: 'Gallery Image 7',
      category: 'Football Tournament 2020',
    },
    {
      id: 8,
      src: cricket_1,
      alt: 'Gallery Image 8',
      category: 'KEA Cricket Tournament',
    },
    {
      id: 9,
      src: cricket_2,
      alt: 'Gallery Image 9',
      category: 'KEA Cricket Tournament',
    },
    {
    id: 10, 
    src: annual_1, 
    alt: 'Gallery Image 10', 
    category: 'KEA Annual Day', 
  },
  {
    id: 11, 
    src: annual_2, 
    alt: 'Gallery Image 11', 
    category: 'KEA Annual Day', 
  },
  {
    id: 12, 
    src: annual_3, 
    alt: 'Gallery Image 12', 
    category: 'KEA Annual Day', 
  },
  {
    id: 13, 
    src: annual_4, 
    alt: 'Gallery Image 13', 
    category: 'KEA Annual Day', 
  },
  {
    id: 14, 
    src: annual_5, 
    alt: 'Gallery Image 14', 
    category: 'KEA Annual Day', 
  },
  {
    id: 15, 
    src: annual_6, 
    alt: 'Gallery Image 15', 
    category: 'KEA Annual Day', 
  },
  {
    id: 16, 
    src: annual_7, 
    alt: 'Gallery Image 16', 
    category: 'KEA Annual Day', 
  },
  {
    id: 17, 
    src: annual_8, 
    alt: 'Gallery Image 17', 
    category: 'KEA Annual Day', 
  },
  {
    id: 18, 
    src: annual_9, 
    alt: 'Gallery Image 18', 
    category: 'KEA Annual Day', 
  },
  {
    id: 19, 
    src: annual_10, 
    alt: 'Gallery Image 19', 
    category: 'KEA Annual Day', 
  },
  {
    id: 20, 
    src: annual_11, 
    alt: 'Gallery Image 20', 
    category: 'KEA Annual Day', 
  },
  {
    id: 21, 
    src: annual_12, 
    alt: 'Gallery Image 21', 
    category: 'KEA Annual Day', 
  },
  {
    id: 22, 
    src: annual_13, 
    alt: 'Gallery Image 22', 
    category: 'KEA Annual Day', 
  },
  {
    id: 23, 
    src: annual_14, 
    alt: 'Gallery Image 23', 
    category: 'KEA Annual Day', 
  },
  {
    id: 24, 
    src: annual_15, 
    alt: 'Gallery Image 24', 
    category: 'KEA Annual Day', 
  }
  ];

  // State
  const [selectedCategory, setSelectedCategory] = useState('New Year 2020');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter images based on selected category
  const filteredImages = images.filter(img => img.category === selectedCategory);

  // Handle image click
  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    setActiveImage(filteredImages[index]);
    setIsLightboxOpen(true);
    // Prevent page scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeLightbox = () => {
    // Reset state
    setIsLightboxOpen(false);
    
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Next and previous images
  const showNextImage = () => {
    const newIndex = (activeIndex + 1) % filteredImages.length;
    setActiveIndex(newIndex);
    setActiveImage(filteredImages[newIndex]);
  };

  const showPrevImage = () => {
    const newIndex = (activeIndex - 1 + filteredImages.length) % filteredImages.length;
    setActiveIndex(newIndex);
    setActiveImage(filteredImages[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeIndex]);

  // Close modal if clicked outside the image
  const handleLightboxBackdropClick = (e) => {
    if (e.target.classList.contains('photo-lightbox')) {
      closeLightbox();
    }
  };

  return (
    <div className="photo-showcase">
      {/* Heading and subtitle */}
      <div className="showcase-intro">
        <h4 className="showcase-tagline">Its Our Great Flows</h4>
        <h2 className="showcase-heading">From Our Gallery</h2>
      </div>

      {/* Category filter menu */}
      <div className="filter-wrapper">
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView="auto"
          spaceBetween={20}
          className="filter-carousel"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat} style={{ width: 'auto' }}>
              <button
                className={`filter-option ${selectedCategory === cat ? 'filter-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Image grid */}
      <div className="thumbnail-mosaic">
        {filteredImages.map((img, index) => (
          <div 
            key={img.id} 
            className="thumbnail-card"
            onClick={() => handleThumbnailClick(index)}
          >
            <img src={img.src} alt={img.alt} className="thumbnail-image" />
            <div className="thumbnail-hover">
              <div className="view-indicator">View</div>
            </div>
          </div>
        ))}
      </div>

      {/* Centered modal with thumbnail slider */}
      {isLightboxOpen && (
        <div className="photo-lightbox" onClick={handleLightboxBackdropClick}>
          <div className="lightbox-panel">
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            
            <div className="lightbox-display">
              <img 
                src={activeImage?.src} 
                alt={activeImage?.alt} 
                className="lightbox-image-fallback" 
              />
            </div>
            
            <div className="lightbox-thumbnails">
              <div className="manual-thumbnails-container">
                {filteredImages.map((img, index) => (
                  <div 
                    key={`thumb-${img.id}`}
                    className={`lightbox-thumbnail ${index === activeIndex ? 'active-thumb' : ''}`}
                    onClick={() => {
                      setActiveIndex(index);
                      setActiveImage(filteredImages[index]);
                    }}
                  >
                    <img 
                      src={img.src} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="thumb-image" 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lightbox-controls">
              <button className="control-button prev-button" onClick={showPrevImage}>
                &lt;
              </button>
              <div className="image-pagination">
                {activeIndex + 1} / {filteredImages.length}
              </div>
              <button className="control-button next-button" onClick={showNextImage}>
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;