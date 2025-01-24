import { ObjectId } from "mongoose";

interface Product {
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

export default Product;