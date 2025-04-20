import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        idVariant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    idUser: {
      type: String,
      required: true,
    },
    status:{
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);
const  Cart = mongoose.model("Cart", cartSchema);
export default Cart;
