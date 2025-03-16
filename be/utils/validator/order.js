import Joi from "joi";

const orderValidator = Joi.object({
  total: Joi.number().min(0).required().messages({
    "any.required": "Tổng tiền là bắt buộc",
    "number.base": "Tổng tiền phải là một số",
    "number.min": "Tổng tiền không thể âm",
  }),
  shippingFee: Joi.number().min(0).required().messages({
    "any.required": "Phí vận chuyển là bắt buộc",
    "number.base": "Phí vận chuyển phải là một số",
    "number.min": "Phí vận chuyển không thể âm",
  }),
  isPaid: Joi.boolean().required().messages({
    "any.required": "Trạng thái thanh toán là bắt buộc",
    "boolean.base": "Trạng thái thanh toán phải là true hoặc false",
  }),
  voucher: Joi.string().optional().allow(null, ""),
  user: Joi.string().allow(null, "").messages({
    "string.base": "Người dùng phải là một chuỗi ID hợp lệ",
  }),
  payment: Joi.string().optional().allow(null, ""),
  receiverInfo: Joi.string().required().messages({
    "any.required": "Thông tin người nhận là bắt buộc",
    "string.base": "Thông tin người nhận phải là một chuỗi ID hợp lệ",
  }),
  itemsOrder: Joi.array()
    .items(
      Joi.string().required().messages({
        "any.required": "Mỗi sản phẩm trong đơn hàng là bắt buộc",
        "string.base": "ID sản phẩm phải là một chuỗi hợp lệ",
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Danh sách sản phẩm là bắt buộc",
      "array.min": "Đơn hàng phải có ít nhất một sản phẩm",
    }),
  status: Joi.string()
    .valid(
      "Chưa xác nhận",
      "Đã xác nhận",
      "Đang giao",
      "Hoàn thành",
      "Hoàn đơn",
      "Đã hủy"
    )
    .default("Chưa xác nhận"),
});

export { orderValidator };
