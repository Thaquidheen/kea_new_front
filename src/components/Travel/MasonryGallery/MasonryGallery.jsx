import React, { useState } from "react";
import "./MasonryGallery.css";
import munnar1 from '../../../assets/munanr2.jpg'
import munnar2 from '../../../assets/munnar3.jpg'
import munnar3 from '../../../assets/munnar.jpg'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// Dummy image data (Replace with real URLs & text)
const allImages = [
  {
    id: 1,
    src: munnar1,
    overlayTitle: "16S",
    overlaySubtitle: "Александр Иванов",
  },
  {
    id: 2,
    src: munnar3,
    overlayTitle: "49S",
    overlaySubtitle: "Алексей Николаев",
  },
  {
    id: 3,
    src: munnar1,
    overlayTitle: "24S",
    overlaySubtitle: "Роман Морозов",
  },
  {
    id: 4,
    src: munnar1,
    overlayTitle: "38S",
    overlaySubtitle: "Иван Петров",
  },
  {
    id: 5,
    src: munnar2,
    overlayTitle: "45S",
    overlaySubtitle: "Дмитрий Кузнецов",
  },
  {
    id: 6,
    src: munnar3,
    overlayTitle: "22S",
    overlaySubtitle: "Илья Соколов",
  },
  {
    id: 7,
    src: munnar2,
    overlayTitle: "45S",
    overlaySubtitle: "Дмитрий Кузнецов",
  },
];
const itemsPerPage = 6;
const MasonryGallery = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [transitionClass, setTransitionClass] = useState("");
  
    // Calculate total pages
    const totalPages = Math.ceil(allImages.length / itemsPerPage);
  
    // Slice images for current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentImages = allImages.slice(indexOfFirstItem, indexOfLastItem);
  
    // Slide animation handler
    const goToPage = (pageNumber) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
  
      // Trigger slide-out
      setTransitionClass("slide-out");
      setTimeout(() => {
        setCurrentPage(pageNumber);
        // After page change, trigger slide-in
        setTransitionClass("slide-in");
        // Remove slide-in class after animation
        setTimeout(() => {
          setTransitionClass("");
        }, 500);
      }, 500);
    };
  
    return (
      <div className="masonry-wrapper">
        <h2>On Sale</h2>
  
        {/* Masonry Container with Slide Animation */}
        <div className={`masonry-container ${transitionClass}`}>
          <div className="masonry">
            {currentImages.map((item) => (
              <div className="masonry-item" key={item.id}>
                <img src={item.src} alt={item.overlaySubtitle} />
                <div className="masonry-overlay">
                  <span className="masonry-title">{item.overlayTitle}</span>
                  <span className="masonry-subtitle">{item.overlaySubtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Pagination Controls */}
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaArrowLeft /> Prev
          </button>
  
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
  
          <button
            className="page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
  );
};

export default MasonryGallery;
