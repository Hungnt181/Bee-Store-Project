import { ObjectId } from "mongoose";
import { Types } from "mongoose";

export interface Complaint {
  _id?: ObjectId;
  name: string;
  email: string;
  description: string;
  status?: "Chờ xử lý" | "Đang xử lý" | "Đã giải quyết" | "Đã từ chối";
  id_order?: ObjectId;
  id_user?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}