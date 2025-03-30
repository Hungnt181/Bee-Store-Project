import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const NotificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    id_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
NotificationSchema.plugin(mongoosePaginate);
const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
