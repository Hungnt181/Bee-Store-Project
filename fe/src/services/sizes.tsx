import axios from "axios";
import { baseApiUrl } from "../constants/urls";

export const sizesServices = {
  getAllSize: async () => {
    try {
      const { data } = await axios.get(`${baseApiUrl}/api/sizes`);
      return data
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  },
};
