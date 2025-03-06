import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    total: {
      type: Number,
    },
    shippingFee: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    updatedAt: {
      type: Date,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    receiverInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReceiverInfo",
    },
    itemsOrder: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemOrder",
        //required: true,
      },
    ],
    status: {
      type: String,
      enum: [
        "Chưa xác nhận",
        "Đã xác nhận",
        "Đang giao",
        "Hoàn thành",
        "Hoàn đơn",
        "Đã hủy",
      ],
      default: "Chưa xác nhận",
    },
  },
  { timestamps: true }
);
OrderSchema.plugin(mongoosePaginate);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
