import { ObjectId } from "mongoose";
import Color from "./Color";
import { ProductType, ProductType2 } from "./Product";
import Size from "./Size";

export interface Variant {
    _id: ObjectId;
  image: string[];
  quantity: number;
  status: boolean;
  id_color: Color;
  id_size: Size;
  id_product: ProductType;
  createdAt: string;
  updatedAt: string;
}

export interface Variant2 {
  _id: ObjectId;
image: string[];
quantity: number;
status: boolean;
id_color: Color;
id_size: Size;
id_product: ProductType2;
createdAt: string;
updatedAt: string;
}



export interface PaginatedVariants {
  variants: Variant[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
