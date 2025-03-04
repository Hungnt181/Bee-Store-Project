import axios from "axios";
import { PaginatedVariants } from "../interface/Variant";

export const variantServices = {
  async getVariantByProductId(id_product: string) {
    const { data } = await axios.get<PaginatedVariants>(
      `http://localhost:3000/api/variants/product/${id_product}`
    );
    return data;
  },
};
 