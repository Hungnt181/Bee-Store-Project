import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    hexcode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Color", colorSchema);
