import Voucher from "../models/vouchers/Voucher.js";

class VoucherController {

    //API controllers
    async apiList(req,res) {
        try {
            //truy vấn danh sách sản phẩm
            const vouchers = await Voucher.find();

            res.status(200).json({ //trả dữ liệu dưới dạng json
                'message': 'Lấy dữ liệu thành công',
                'data': vouchers,
            })
        } catch (error) {
            res.status(400).json({
                'message': 'Something went wrong'
            })
        };
    }

    async apiDetail(req,res) {
        try {
            //B1: lấy id bản ghi cần xem chi tiết
            const id = req.params.id;
            //B2: truyền id lên truy vấn trong mongo
            const voucher = await Voucher.findById(id);
            //B3: trả dữ liệu
            res.status(200).json({
                'message': 'Thành công',
                'data': voucher
            })
        } catch (error) {
            res.status(400).json({
                'message': 'Something went wrong'
            })
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

    async apiCreate(req,res) {
        try {
            //B1: lấy dữ liệu người dùng gửi lên
            const data = req.body;
            //B2: đẩy dữ liệu lên, lưu vào DB
            const newVoucher = await Voucher.create(data);
            //B3: trả dữ liệu về
            res.status(200).json({
                'message': 'Thêm mới thành công',
                'data': newVoucher
            })
        } catch (error) {
            res.status(400).json({
                'message': 'Something went wrong'
            })
        }
    }

    async apiUpdate(req,res) {
        try {
            //B1: lấy id bản ghi cần sửa
            const id = req.params.id;
            //B2: lấy dữ liệu mới
            const data = req.body;
            //B3: đẩy dữ liệu lưu vào DB
            const voucher = await Voucher.findByIdAndUpdate(id,data);
            //B4: trả về dữ liệu
            res.status(200).json({
                'message': 'Chỉnh sửa thành công',
                'data': voucher
            })
        } catch (error) {
            res.status(400).json({
                'message': 'Something went wrong'
            })
        }
    }
}
export default VoucherController