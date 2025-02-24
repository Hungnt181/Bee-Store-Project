import { ObjectId } from "mongoose";
import { Category } from "./Category";

export interface Product {
    _id: ObjectId;
  name: {
    type: string;
    minLength: 3;
    required: true;
    unique: true;
  };
  price: {
    type: number;
    required: true;
  };
  about: {
    type: string;
    required: true;
  };
  description?: {
    type: string;
    required: false;
  };
  status: {
    type: boolean;
    default: true;
  };
  id_cate: {
    type: ObjectId;
    ref: "Category";
  };
  slug?: {
    type: string;
    unique: true;
  };
}
export type ProductType = {
  _id: string;
  name: string;
  price: number;
  about: string;
  description: string;
  status: boolean;
  id_cate: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductType2 = {
  _id: string;
  name: string;
  price: number;
  about: string;
  description: string;
  status: boolean;
  id_cate: Category;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export interface ProductResponse {
  products: ProductType[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};