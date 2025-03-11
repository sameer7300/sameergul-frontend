import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1/portfolio/";

export const getProjects = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
