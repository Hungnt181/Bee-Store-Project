import Voucher from "../../models/vouchers/Voucher.js";
import { voucherJoi } from "../../utils/validator/voucher.js";
 // Đường dẫn tùy thuộc vào cấu trúc project

class VoucherController {
  // Lấy tất cả voucher (admin)
  async apiList(req, res) {
    try {
      const vouchers = await Voucher.find();
      res.status(200).json({
        message: "Danh sách vouchers",
        data: vouchers,
      });
    } catch (error) {
      res.status(400).json({ message: "Something went wrong" });
    }
  }

  // Lấy voucher active (client)
  async apiListClient(req, res) {
    try {
      const vouchers = await Voucher.find({ status: true });
      res.status(200).json({
        message: "Danh sách vouchers",
        data: vouchers,
      });
    } catch (error) {
      res.status(400).json({ message: "Something went wrong" });
    }
  }

  // Chi tiết voucher
  async apiDetail(req, res) {
    try {
      const id = req.params.id;
      const voucher = await Voucher.findById(id);
      res.status(200).json({
        message: "Thành công",
        data: voucher,
      });
    } catch (error) {
      res.status(400).json({ message: "Something went wrong" });
    }
  }

  // Tạo mới voucher
  async apiCreate(req, res) {
    try {
      // Validate dữ liệu đầu vào
      const { error } = voucherJoi.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: error.details.map((err) => err.message),
        });
      }

      const { codeName } = req.body;

      // Kiểm tra trùng mã code
      const existingCodeName = await Voucher.findOne({ codeName });
      if (existingCodeName) {
        return res.status(400).json({ message: "Mã voucher này đã tồn tại" });
      }

      const newVoucher = await Voucher.create(req.body);

      res.status(200).json({
        message: "Thêm mới thành công",
        data: newVoucher,
      });
    } catch (error) {
      res.status(400).json({ message: "Something went wrong" });
    }
  }

  // Cập nhật voucher
  async apiUpdate(req, res) {
    try {
      const id = req.params.id;

      // Validate dữ liệu đầu vào
      const { error } = voucherJoi.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: error.details.map((err) => err.message),
        });
      }

      const { codeName } = req.body;

      // Kiểm tra trùng mã code (ngoại trừ chính nó)
      const existingCodeName = await Voucher.findOne({
        codeName,
        _id: { $ne: id },
      });

      if (existingCodeName) {
        return res.status(400).json({ message: "Mã voucher này đã tồn tại" });
      }

      const voucher = await Voucher.findByIdAndUpdate(id, req.body, { new: true });

      res.status(200).json({
        message: "Chỉnh sửa thành công",
        data: voucher,
      });
    } catch (error) {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
}

export default VoucherController;
