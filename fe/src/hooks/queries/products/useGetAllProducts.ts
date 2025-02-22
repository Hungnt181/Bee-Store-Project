import { useQuery } from "@tanstack/react-query"
import { productServices } from "../../../services/products"

export const useGetAllProducts = ()=>{
    return useQuery({
        queryKey: ['PRODUCTS'],
        queryFn: async()=>{
            return await productServices.getAllProducts()
        }
    })
}