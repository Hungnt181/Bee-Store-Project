import mongoose, { Schema } from "mongoose";

const PaymentSchema=Schema({
    name: { 
        type: String, 
        required: true 
    },

    status: { 
        type: String,
        required: true 
    },
});
export default mongoose.model("Payment", PaymentSchema);