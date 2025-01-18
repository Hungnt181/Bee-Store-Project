import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    id_cate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false }
);
ProductSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", ProductSchema);

export default Product;
