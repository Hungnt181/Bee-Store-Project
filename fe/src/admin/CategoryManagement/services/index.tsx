import axios from "axios";
import { Category } from "../../../interface/Category";
const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

export const CategoryService = {
  getAllCategories: async () => {
    try {
      const { data } = await axios.get(`${baseApiUrl}/api/categories`);
      return data.data.map((item: Category) => ({
        key: item._id,
        ...item,
      }));
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  },

  getDetailCategory: async (id: string) => {
    try {
      const { data } = await axios.get(`${baseApiUrl}/api/categories/${id}`);
      return data.data
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  },

  createCategory: async (newCategory: Category) => {
    try {
      await axios.post(`${baseApiUrl}/api/categories`, newCategory)
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  }
};