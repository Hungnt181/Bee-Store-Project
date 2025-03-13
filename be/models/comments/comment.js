import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    id_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noidung_bl: { type: String, required: true, minlength: 5, maxlength: 500 },
    ngay_bl: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
