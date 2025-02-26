import { useQuery } from "@tanstack/react-query"
import { colorsServices } from "../../../services/colors"
import { REACT_QUERY_KEYS } from "../../../constants/querykeys"

export const useGetAllColors = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_COLORS],
    queryFn: colorsServices.getAllColors
  })
}