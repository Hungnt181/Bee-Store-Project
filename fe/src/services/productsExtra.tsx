import axios from "axios";
import { baseApiUrl } from "../constants/urls";
import { IPageProductConditions, IParamsProductCondition } from "../interface/Product";

export const ProductsExtraService = {
  getProductsWithConditions: async (params: IParamsProductCondition) => {
    try {
      const { data } = await axios.get<IPageProductConditions>(
        `${baseApiUrl}/api/products/conditions`, { params }
      );
      return data
    } catch (error) {
      throw new Error(`Opp!!! ${error}`);
    }
  },
}