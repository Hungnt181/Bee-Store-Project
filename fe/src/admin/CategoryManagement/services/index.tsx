import axios from "axios";
const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

export const CategoryService = {
  getAllCategories: async () => {
    try {
      const res = await axios.get(`${baseApiUrl}/api/categories`);
      return res.data;
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  } 
};