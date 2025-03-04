import axios from "axios";
import { baseApiUrl } from "../constants/urls";

export const colorsServices = {
  getAllColors: async () => {
    try {
      const { data } = await axios.get(`${baseApiUrl}/api/colors`);
      return data
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  },
};
