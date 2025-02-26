import { useQuery } from "@tanstack/react-query";
import { ProductsExtraService } from "../../../services/productsExtra";
import { REACT_QUERY_KEYS } from "../../../constants/querykeys";
import { IParamsProductCondition } from "../../../interface/Product";

export const useGetProductsWithConditions = (params: IParamsProductCondition) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PRODUCTS_WITH_CONDITIONS, params],
    queryFn: () => ProductsExtraService.getProductsWithConditions(params),
  });
};