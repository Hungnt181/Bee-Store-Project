import { ObjectId } from "mongoose";

export interface ReceiverInfo {
    _id: ObjectId;
  name: {
    type: string;
    required: true;
    unique: true;
  };
  phone: {
    type: string;
    required: true;
  };
  address: {
    type: string;
    required: true;
  }
}
