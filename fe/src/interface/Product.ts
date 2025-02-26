import { ObjectId } from "mongoose";

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

export interface IVariant {
  _id: string;
  image: string[];
  quantity: number;
  status: boolean;
  id_color: string;
  id_size: string;
  id_product: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductWithVariants {
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
  variants: IVariant[];
}

export interface IPageProductConditions {
  total: number;
  content: {
    products: IProductWithVariants[]
  }
}

export interface IParamsProductCondition {
  cate?: string | string[];
  color?: string | string[];
  size?: string | string[];
  priceMin?: number | string;
  priceMax?: number | string;
}
