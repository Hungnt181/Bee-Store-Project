import color from "./models/colors/color";
import { colorJoi } from "./utils/validator/color";
//them
export const add = async (req, res) => {
  try {
    const { error } = colorJoi.validate(req.body, { abortEarly: false });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message).join(", ") });
    }
    const checkHexcode = await color.findOne({ hexcode: req.body.hexcode });
    if (checkHexcode) {
      return res.status(400).json({ message: "Ma mau da ton tai" });
    }
    const data = await color.create(req.body);
    res.status(200).json({ message: "Them mau thanh cong", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//hienthi
export const list = async (req, res) => {
  try {
    const data = await color.find();
    res.status(200).json({ message: "Danh sach mau", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//chitiet
export const detail = async (req, res) => {
  try {
    const data = await color.findById(req.params.id);
    res.status(200).json({ message: "Chi tiet mau", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//xoa
export const remove = async (req, res) => {
  try {
    const data = await color.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xoa mau thanh cong", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//sua
export const edit = async (req, res) => {
  try {
    const { error } = colorJoi.validate(req.body, { abortEarly: false });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message).join(", ") });
    }
    const checkHexcode = await color.findOne({
      hexcode: req.body.hexcode,
      _id: { $ne: req.params.id },
    });
    if (checkHexcode) {
      return res.status(400).json({ message: "Ma mau da ton tai" });
    }
    const data = await color.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Cap nhat mau thanh cong", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
