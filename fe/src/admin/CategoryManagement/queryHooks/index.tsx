import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "../services";
import { REACT_QUERY_KEYS } from "../../../constants/querykeys";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES],
    queryFn: () => CategoryService.getAllCategories(),
  });
};