import mongoose, { mongo, Schema } from "mongoose"

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tel: { type: String },
    address: { type: String },
    role: {
        type: String,
        enum: ['user', 'admin']
    },
    status: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

export default User