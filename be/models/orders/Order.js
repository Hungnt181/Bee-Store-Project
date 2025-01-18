import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        total:{
            type: Number
        },
        shippingFee:{
            type: Number
        },
        isPaid:{
            type: Boolean
        },
        createdAt:{
            type: Date
        },
        updatedAt:{
            type: Date
        },
        voucher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voucher",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        },
        receiverInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReceiverInfo",
        },
        itemsOrder: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ItemsOrders",
                //required: true,
            },
        ],
        statue:{
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)
const Order = mongoose.model('Order', OrderSchema);

export default Order;