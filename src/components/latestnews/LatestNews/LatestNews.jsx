import React from "react";
import "./LatestNews.css";

// Sample news data
const newsArticles = [
  {
    id: 1,
    title: "Best Strategy to Achieve Profitable Harvest.",
    date: "October 23, 2023",
    description:
      "Optimal strategies for achieving profitable harvests involve a comprehensive approach to farm management, selection of appropriate crop varieties, implementation of efficient practices.",
    image: "https://via.placeholder.com/600x400", // Replace with actual image
  },
  {
    id: 2,
    title: "Abundant Harvest from Agricultural Farm Land Shows Success.",
    date: "October 23, 2023",
    image: "https://via.placeholder.com/300x200", // Replace with actual image
  },
  {
    id: 3,
    title: "Latest Innovations Increasing Milk Production and Quality.",
    date: "October 23, 2023",
    image: "https://via.placeholder.com/300x200", // Replace with actual image
  },
  {
    id: 4,
    title: "Best Practices in Harvesting Vegetables from Plantations.",
    date: "October 23, 2023",
    image: "https://via.placeholder.com/300x200", // Replace with actual image
  },
];

const LatestNews = () => {
  return (
    <section className="latest-news">
      <h2>Latest News</h2>
      <div className="news-container">
        {/* Main Article */}
        <div className="main-article">
          <img src={newsArticles[0].image} alt={newsArticles[0].title} />
          <p className="news-date">{newsArticles[0].date}</p>
          <h3>{newsArticles[0].title}</h3>
          <p className="news-description">{newsArticles[0].description}</p>
        </div>

        {/* Side Articles */}
        <div className="side-articles">
          {newsArticles.slice(1).map((article) => (
            <div key={article.id} className="side-article">
              <img src={article.image} alt={article.title} />
              <div className="side-text">
                <p className="news-date">{article.date}</p>
                <h4>{article.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
