import { useQuery } from "@tanstack/react-query"
import { sizesServices } from "../../../services/sizes"
import { REACT_QUERY_KEYS } from "../../../constants/querykeys"

export const useGetAllSizes = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_SIZES],
    queryFn: sizesServices.getAllSize
  })
}