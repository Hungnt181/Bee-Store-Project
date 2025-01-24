import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const VariantSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    id_color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
    id_size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
    },
    id_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true, versionKey: false }
);
VariantSchema.plugin(mongoosePaginate);
const Variant = mongoose.model("Variant", VariantSchema);

export default Variant;
