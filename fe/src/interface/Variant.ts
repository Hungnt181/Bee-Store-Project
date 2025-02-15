import { ObjectId } from "mongoose";

interface Variant {
    _id: ObjectId;
  image: string[];
  quantity: number;
  status?: boolean; 
  id_color?:  ObjectId;
  id_size?:  ObjectId;
  id_product?: ObjectId;
}

export default Variant;