import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const VoucherSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        codeName:{
            type: String,
            required: true,
            unique: true
        },
        value:{
            type: Number,
            required: true
        },
        quantity:{
            type: Number
        },
        description:{
            type: String
        },
        startTime:{
            type: Date
        },
        endTime:{
            type: Date
        },
        statue:{
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)
const Voucher = mongoose.model('Voucher', VoucherSchema);

export default Voucher;