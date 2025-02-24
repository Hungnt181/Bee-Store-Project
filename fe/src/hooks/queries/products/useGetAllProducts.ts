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

export const useGetProById_category = (id: string) => {
    return useQuery({
      queryKey: ['PRODUCTS_CATE', id],
      queryFn: async () => {
        return await productServices.getProductByID_cate(id);
      },
    });
  };