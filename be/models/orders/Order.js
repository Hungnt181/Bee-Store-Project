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
    updatedStatusByAdmin: {
      type: String,
      default: null,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      required: false,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    receiverInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receiver",
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
        "Giao hàng thất bại",
        "Đã hủy",
      ],
      default: "Chưa xác nhận",
    },
    cancel_reason: {
      type: String,
      default: null,
    },
    cancel_by: {
      type: String,
      default: null,
    },
    isComplaint: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
OrderSchema.plugin(mongoosePaginate);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
