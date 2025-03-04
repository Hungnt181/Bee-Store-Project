import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "../../../constants/querykeys";
import { CategoryService } from "../../../services/categories";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES_CLIENTS],
    queryFn: CategoryService.getAllCategories,
  });
};