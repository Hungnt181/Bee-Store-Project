import mongoose, { Schema } from "mongoose";
const ColorSchema = Schema(
  {
    name: { type: String, required: true },
    hexcode: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("Color", ColorSchema);
