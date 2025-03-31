import axios from "axios";

const API_BASE_URL = "https://backend/api"; // replace with the backend

// get category 
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null; 
  }
};

// others....
export const getNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
};

