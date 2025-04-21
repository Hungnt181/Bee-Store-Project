import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VoucherSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    codeName: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return this.maxValue ? v <= this.maxValue : true;
        },
        message: props => `Giá trị value (${props.value}) không được lớn hơn maxValue.`,
      },
    },
    maxValue: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return this.startTime ? v > this.startTime : true;
        },
        message: 'Thời gian kết thúc phải sau thời gian bắt đầu.',
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", VoucherSchema);

export default Voucher;
