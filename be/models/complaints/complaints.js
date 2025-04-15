import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ComplaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Chờ xử lý", "Đang xử lý", "Đã giải quyết", "Đã từ chối"],
      default: "Chờ xử lý",
    },
    id_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);
ComplaintSchema.plugin(mongoosePaginate);
const Complaint = mongoose.model("Complaint", ComplaintSchema);

export default Complaint;
