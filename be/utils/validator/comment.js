import Joi from "joi";
import joiObjectId from "joi-objectid";
import leoProfanity from "leo-profanity";

Joi.objectId = joiObjectId(Joi); // Thêm hỗ trợ ObjectId

// Nạp danh sách từ cấm tiếng Anh
leoProfanity.loadDictionary("en");

/// Thêm danh sách từ cấm tiếng Việt
const vietBadWords = [
  // Từ ngữ thô tục, tục tĩu
  "địt",
  "tục",
  "chửi",
  "cặc",
  "lồn",
  "buồi",
  "dái",
  "đéo",
  "đĩ",
  "vãi",
  "lol",
  "clgt",
  "dm",
  "vkl",
  "cc",
  "đjt",
  "đmm",
  "cl",
  "cc",
  "vl",
  "ml",
  "bml",
  "ngu",
  "chó",
  "đần",
  "khùng",
  "điếm",
  "cút",
  // Từ ngữ liên quan đến spam, lừa đảo, cheat
  "fake",
  "scam",
  "lừa đảo",
  "hack",
  "cheat",
  "tool",
  "mod",
  "auto",
  "bypass",
  "crack",
  "bot",
  "ddos",
  "exploit",
  "h@ck",
];
leoProfanity.add(vietBadWords);

export const commentJoi = Joi.object({
  id_product: Joi.objectId().required().messages({
    "any.required": "id_product là bắt buộc",
    "string.pattern.name": "id_product không hợp lệ",
  }),
  id_user: Joi.objectId().required().messages({
    "any.required": "id_user là bắt buộc",
    "string.pattern.name": "id_user không hợp lệ",
  }),
  noidung_bl: Joi.string()
    .min(5)
    .max(500)
    .required()
    .custom((value, helpers) => {
      if (leoProfanity.check(value)) {
        return helpers.message("Nội dung bình luận chứa từ ngữ không phù hợp.");
      }
      return value;
    })
    .messages({
      "string.empty": "Nội dung bình luận không được để trống",
      "string.min": "Nội dung bình luận phải có ít nhất 5 ký tự",
      "string.max": "Nội dung bình luận không được dài quá 500 ký tự",
    }),
  status: Joi.boolean(),
});
