import { ObjectId } from "mongoose";
import User from "./User";
import Payment from "./Payment";
import { VoucherInput } from "./Voucher";
import { ItemOrder } from "./ItemOrder";
import { ReceiverInfo } from "./ReceiverInfo";

export interface Order {
  _id: ObjectId;
  total?: number;
  shippingFee?: number;
  isPaid?: boolean;
  isConfirm?: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedStatusByAdmin?: string;
  voucher?: VoucherInput;
  user?: User;
  payment?: Payment;
  receiverInfo?: ReceiverInfo;
  itemsOrder: ItemOrder;
  status:
    | "Chưa xác nhận"
    | "Đã xác nhận"
    | "Đang giao"
    | "Hoàn thành"
    | "Hoàn đơn"
    | "Đã hủy";
}

export interface bestSelling {
  totalSold: number;
  variantId: ObjectId;
  variantImage: Array<string>;
  colorName: string;
  colorSize: string;
  productName: string;
  productID: ObjectId;
  productPrice: number;
  slug: string;
  status: boolean;
}
