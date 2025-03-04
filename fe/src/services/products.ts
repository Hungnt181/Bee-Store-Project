import axios from "axios"
import { ProductResponse } from "../interface/Product"

export const productServices = {
    getAllProducts: async()=>{
        const {data} = await axios.get<ProductResponse>('http://localhost:3000/api/products')
        return data
    },
    getProductByID_cate : async (id:string) => {
        const {data} = await axios.get(`http://localhost:3000/api/products/category/${id}?_limit=4`)
        return data
    }
}


