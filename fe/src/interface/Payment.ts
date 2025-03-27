import { ObjectId } from "mongoose";

interface Payment {
    _id: ObjectId;
  name: string;
  status: boolean
}

export default Payment;