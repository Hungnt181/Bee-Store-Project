import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ItemOrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    id_variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },
  },
  { timestamps: true, versionKey: false }
);
ItemOrderSchema.plugin(mongoosePaginate);
const ItemOrder = mongoose.model("ItemOrder", ItemOrderSchema);

export default ItemOrder;
