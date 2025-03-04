import { ObjectId } from "mongoose";
import User from "./User";
import Payment from "./Payment";

export interface Order {
    _id: ObjectId;
    total?: number;
    shippingFee?: number;
    isPaid?: boolean;
    createdAt: Date;
    updatedAt: Date;
    voucher?: {
        type: ObjectId;
        ref: "Voucher"
    };
    user?: User;
    payment?:Payment
    receiverInfo?: {
        type: ObjectId;
        ref: "ReceiverInfo"
    };
    itemsOrder:Order
    status: "Chưa xác nhận" | "Đã xác nhận" | "Đang giao" | "Hoàn thành" | "Hoàn đơn" | "Đã hủy";
}
