import axios from "axios";
import { Category } from "../../../interface/Category";
const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

export const CategoryService = {
  getAllCategories: async (param: string) => {
    try {
      console.log(baseApiUrl);

      const { data } = await axios.get(
        `${baseApiUrl}/api/categories/search?key=${param}`
      );
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
      return data.data;
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  },

  createCategory: async (data: Category) => {
    try {
      await axios.post(`${baseApiUrl}/api/categories`, data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`${error.response?.data?.message || error.message}`);
      } else {
        throw new Error(`Opp!!! Thêm danh mục thất bại`);
      }
    }
  },

  updateCategory: async (data: Category, id: string) => {
    try {
      await axios.put(`${baseApiUrl}/api/categories/${id}`, data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`${error.response?.data?.message || error.message}`);
      } else {
        throw new Error(`Opp!!! Cập nhật danh mục thất bại`);
      }
    }
  },
};
