import { ObjectId } from "mongoose";

export interface ItemOrder {
    _id: ObjectId;
  name: {
    type: string;
    minLength: 3;
    required: true;
    unique: true;
  };
  quantity: {
    type: number;
    required: true;
  };
  id_variant: {
    type: ObjectId;
    ref: "Variant"
};
}
