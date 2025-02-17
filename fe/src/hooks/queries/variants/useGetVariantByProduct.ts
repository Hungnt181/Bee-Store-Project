import { useQuery } from "@tanstack/react-query";
import { variantServices } from "../../../services/variants";

export const useGetVariantByProduct = (id: string) => {
  return useQuery({
    queryKey: ["VARIANT_PRODUCT", id],
    queryFn: async () => await variantServices.getVariantByProductId(id),
  });
};
