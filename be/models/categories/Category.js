import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true},
    status: {type: Boolean, required: true}
})

const Category = mongoose.model("Category", CategorySchema);

export default Category