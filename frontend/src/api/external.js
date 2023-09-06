import axios from "axios";

const NEWS_API = process.env.REACT_APP_API_KEY;

const NEWS_API_ENDPOINTS = `https://newsapi.org/v2/everything?q=tesla&from=2023-08-06&sortBy=publishedAt&apiKey=${NEWS_API}`;

export const fetchNewsArticles = async () => {
  try {
    const response = await axios.get(NEWS_API_ENDPOINTS);
    return response.data.articles.slice(0, 15);
  } catch (error) {
    throw error;
  }
};
