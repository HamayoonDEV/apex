import React from "react";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { fetchNewsArticles } from "../../api/external";
import Loader from "../Loader/Loader";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async function getArticles() {
      try {
        const articles = await fetchNewsArticles();
        setArticles(articles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        // Maybe set some state to show an error message to the user
      }
    })();
  }, []);
  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };
  if (articles.length == 0) {
    return <Loader text="Loading HomePage" />;
  }
  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        {articles.map((article) => (
          <div
            className={styles.card}
            key={article.title}
            onClick={() => {
              handleCardClick(article.url);
            }}
          >
            <img src={article.urlToImage} alt={article.title} />
            <h1>{article.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
