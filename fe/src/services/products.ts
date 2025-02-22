import axios from "axios"
import { ProductResponse } from "../interface/Product"

export const productServices = {
    getAllProducts: async()=>{
        const {data} = await axios.get<ProductResponse>('http://localhost:3000/api/products')
        return data
    }
}