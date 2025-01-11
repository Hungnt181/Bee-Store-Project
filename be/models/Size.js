import mongoose, { Schema } from "mongoose";

const SizeSchema = new Schema({
    name: {type: String, required: true}
})

const Size = mongoose.model("Size", SizeSchema);

export default Size