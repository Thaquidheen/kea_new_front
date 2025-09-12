import React, { useState } from "react";
import "./LatestArticles.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Sample articles data
const articles = [
  {
    id: 1,
    title: "Exploring Potential and Challenges in Global Agriculture.",
    date: "October 23, 2023",
    description:
      "Uncovering the Vast Potential and Complex Challenges in the World of Global Agriculture.",
    image: "https://via.placeholder.com/300x200", // Replace with actual image
  },
  {
    id: 2,
    title: "Bringing Change in the Livestock Industry.",
    date: "October 23, 2023",
    description:
      "Revealing Innovations, Challenges and Transformation Potential that Bring Positive Change.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 3,
    title: "Potential and Constraints Faced in Production Quality.",
    date: "October 23, 2023",
    description:
      "Discusses Challenges and Opportunities in Achieving High Production Standards.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 4,
    title: "Achieving High Productivity from Your Own Home Garden.",
    date: "October 23, 2023",
    description:
      "A Practical Guide to Achieving Satisfactory Results from Plants Grown in Your Home.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 5,
    title: "The Best Guide to Planting Seeds with Optimal Results.",
    date: "October 23, 2023",
    description:
      "Effective Strategies and Techniques to Achieve Healthy and Productive Plant Growth.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 6,
    title:
      "Strategies for Caring for Your Garden More Efficiently and Productively.",
    date: "October 23, 2023",
    description:
      "An approach that improves plant performance and makes garden management easier.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 7,
    title:
      "Strategies for Caring for Your Garden More Efficiently and Productively.",
    date: "October 23, 2023",
    description:
      "An approach that improves plant performance and makes garden management easier.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 8,
    title:
      "Strategies for Caring for Your Garden More Efficiently and Productively.",
    date: "October 23, 2023",
    description:
      "An approach that improves plant performance and makes garden management easier.",
    image: "https://via.placeholder.com/300x200",
  },
];

// Pagination settings
const itemsPerPage = 6;

const LatestArticles = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  // Get the current articles for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <section className="latest-articles">
      <h2>Latest Articles</h2>

      {/* Articles Grid */}
      <div className="articles-grid">
        {currentArticles.map((article) => (
          <div key={article.id} className="article-card">
            <img src={article.image} alt={article.title} />
            <p className="article-date">{article.date}</p>
            <h3>{article.title}</h3>
            <p className="article-description">{article.description}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaArrowLeft /> Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => goToPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="pagination-btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default LatestArticles;
