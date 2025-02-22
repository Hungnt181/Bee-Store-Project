import Size from "../../models/sizes/Size.js";

class SizeController {
	async list(req, res) {
		try {
			const size = await Size.find();
			return res.status(200).json({
				message: "Lấy danh sách kích cỡ thành công",
				data: size,
			});
		} catch (error) {
			return res.status(500).json({
				message: "something went wrong",
			});
		}
	}
async remove(req, res) {
		try {
			const size = await Size.findByIdAndDelete(req.params.id);
			return res.status(200).json({
				message: "Xóa kích thước thành công",
				data: size,
			});
		} catch (error) {
			return res.status(500).json({
				message: "something went wrong",
			});
		}
	}

	async detail(req, res) {
		try {
			const size = await Size.findById(req.params.id);
			return res.status(200).json({
				message: "Lấy chi tiết kích cỡ thành công",
				data: size,
			});
		} catch (error) {
			return res.status(500).json({
				message: "something went wrong",
			});
		}
	}

	async create(req, res) {
		try {
            const existedSize = await Size.findOne({name: req.body.name});
            if(existedSize) {
                return res.status(400).json({
					message: "Tên size đã tồn tại",
				});
            }
			const size = await Size.create(req.body);
			return res.status(200).json({
				message: "Thêm mới kích cỡ thành công",
				data: size,
			});
		} catch (error) {
			return res.status(500).json({
				message: "something went wrong",
			});
		}
	}

	async edit(req, res) {
		try {
            const existedSize = await Size.findOne({name: req.body.name});
            if(existedSize) {
                return res.status(400).json({
					message: "Tên size đã tồn tại",
				});
            }
			const size = await Size.findByIdAndUpdate(req.params.id, req.body);
			return res.status(200).json({
				message: "Cập nhật kích cỡ thành công",
				data: size,
			});
		} catch (error) {
			return res.status(500).json({
				message: "something went wrong",
			});
		}
	}
}

export default SizeController;
