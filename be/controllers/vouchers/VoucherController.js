import Voucher from "../../models/vouchers/Voucher";

class VoucherController {
  //API controllers
  async apiList(req, res) {
    try {
      //truy vấn danh sách sản phẩm
      const vouchers = await Voucher.find();

      res.status(200).json({
        //trả dữ liệu dưới dạng json
        message: "Danh sách vouchers",
        data: vouchers,
      });
    } catch (error) {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }

  async apiDetail(req, res) {
    try {
      const id = req.params.id;

      const voucher = await Voucher.findById(id);

      res.status(200).json({
        message: "Thành công",
        data: voucher,
      });
    } catch (error) {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }

  // async apiDelete(req,res) {
  //     try {
  //         // //B1: lấy id bản ghi cần xóa
  //         // const id = req.params.id;
  //         // //B2: gửi id lên để truy vấn
  //         // const deletedVoucher = await Voucher.findByIdAndUpdate(id);
  //         // //B3: trả dữ liệu về
  //         // res.status(200).json({
  //         //     'message': 'Xóa thành công',
  //         //     'data': deletedVoucher
  //         // })
  //          //B1: lấy id bản ghi cần sửa
  //          const id = req.params.id;
  //          //B2: lấy dữ liệu mới
  //          const data = req.body;
  //          //B3: đẩy dữ liệu lưu vào DB
  //          const voucher = await Voucher.findByIdAndUpdate(id,data);
  //          //B4: trả về dữ liệu
  //          res.status(200).json({
  //              'message': 'Xóa thành công',
  //              'data': voucher
  //          })
  //     } catch (error) {
  //         res.status(400).json({
  //             'message': 'Something went wrong'
  //         })
  //     }
  // }

  async apiCreate(req, res) {
    try {
      // Kiểm tra unique, kiểm tra số
      const { codeName, value, maxValue } = req.body;
      const existingCodeName = await Voucher.findOne({ codeName });
      if (existingCodeName) {
        return res.status(400).json({ message: "CodeName này đã tồn tại" });
      }
      if (typeof value !== "number") {
        return res.status(400).json({ message: "Value phải là kiểu số" });
      }
      if (typeof maxValue !== "number") {
        return res.status(400).json({ message: "MaxValue phải là kiểu số" });
      }

      const data = req.body;

      const newVoucher = await Voucher.create(data);

      res.status(200).json({
        message: "Thêm mới thành công",
        data: newVoucher,
      });
    } catch (error) {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }

  async apiUpdate(req, res) {
    try {
      const id = req.params.id;

      const data = req.body;

      // Kiểm tra unique, kiểm tra số
      const { codeName, value, maxValue } = req.body;
      const existingCodeName = await Voucher.findOne({
        codeName,
        _id: { $ne: id }
      });
      if (existingCodeName) {
        return res.status(400).json({ message: "CodeName này đã tồn tại" });
      }
      if (typeof value !== "number") {
        return res.status(400).json({ message: "Value phải là kiểu số" });
      }
      if (typeof maxValue !== "number") {
        return res.status(400).json({ message: "MaxValue phải là kiểu số" });
      }

      const voucher = await Voucher.findByIdAndUpdate(id, data);

      res.status(200).json({
        message: "Chỉnh sửa thành công",
        data: voucher,
      });
    } catch (error) {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }
}
export default VoucherController;
