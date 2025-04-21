import Joi from "joi";

export const voucherJoi = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tiêu đề không được để trống",
    "string.min": "Tiêu đề phải có ít nhất 2 ký tự",
    "string.max": "Tiêu đề không được dài quá 100 ký tự",
    "any.required": "Tiêu đề là bắt buộc",
  }),

  codeName: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Mã code không được để trống",
    "string.alphanum": "Mã code chỉ được chứa ký tự chữ và số",
    "string.min": "Mã code phải có ít nhất 3 ký tự",
    "string.max": "Mã code không được dài quá 30 ký tự",
    "any.required": "Mã code là bắt buộc",
  }),

  value: Joi.number().min(0).required().messages({
    "number.base": "Giá trị phải là số",
    "number.min": "Giá trị phải lớn hơn hoặc bằng 0",
    "any.required": "Giá trị là bắt buộc",
  }),

  maxValue: Joi.number().min(0).required().messages({
    "number.base": "Giá trị tối đa phải là số",
    "number.min": "Giá trị tối đa phải lớn hơn hoặc bằng 0",
    "any.required": "Giá trị tối đa là bắt buộc",
  }),

  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Số lượng phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng không được âm",
    "any.required": "Số lượng là bắt buộc",
  }),

  description: Joi.string().allow("").max(255).messages({
    "string.max": "Mô tả không được dài quá 255 ký tự",
  }),

  startTime: Joi.date().required().messages({
    "date.base": "Thời gian bắt đầu không hợp lệ",
    "any.required": "Thời gian bắt đầu là bắt buộc",
  }),

  endTime: Joi.date().greater(Joi.ref("startTime")).required().messages({
    "date.base": "Thời gian kết thúc không hợp lệ",
    "date.greater": "Thời gian kết thúc phải sau thời gian bắt đầu",
    "any.required": "Thời gian kết thúc là bắt buộc",
  }),

  status: Joi.boolean().messages({
    "boolean.base": "Trạng thái phải là true hoặc false",
  }),
});
