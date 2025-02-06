import { ObjectId } from "mongoose";

interface Category {
    _id: ObjectId;
  name: string;
  status?: boolean; 
}

export default Category;