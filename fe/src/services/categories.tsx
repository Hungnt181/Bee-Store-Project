import axios from "axios";
import { baseApiUrl } from "../constants/urls";

export const CategoryService = {
  getAllCategories: async () => {
    try {
      const { data } = await axios.get(
        `${baseApiUrl}/api/categories`
      );
      return data
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  },
}