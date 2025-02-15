import { ObjectId } from "mongoose";

interface Color {
    _id: ObjectId;
  name: string;
  hexcode?: boolean; 
}

export default Color;