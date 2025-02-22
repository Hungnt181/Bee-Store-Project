import Category from "../../models/categories/Category.js";
import cateValidate from "../../utils/validator/cateValidators.js";
import StatusCodes from "http-status-codes";

class CategoryController {
	async list(req, res) {
		try {
			const category = await Category.find();
			return res.status(StatusCodes.OK).json({
				message: "Lấy danh sách danh mục thành công",
				data: category,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}

	async search(req, res) {
		try {
			const category = await Category.find();
			const { key } = req.query;
			let filteredCategories = category;
			if (key) {
				const lowerCaseKey = key.toLowerCase();
				filteredCategories = category.filter((cate) => cate.name.toLowerCase().includes(lowerCaseKey));
			}
			filteredCategories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			return res.status(StatusCodes.OK).json({	
				message: "Tìm kiếm danh mục thành công",
				data: filteredCategories,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}

	async detail(req, res) {
		try {
			const category = await Category.findById(req.params.id);
			if(!category) {
				return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy danh mục",
        });
			}
			return res.status(StatusCodes.OK).json({
				message: "Lấy chi tiết danh mục thành công",
				data: category,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}

	async create(req, res) {
		try {
			const { error } = cateValidate.validate(req.body, { abortEarly: false });
			if (error) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: error.details.map((item) => item.message),
				});
			}
			const existedCate = await Category.findOne({ name: req.body.name });
			if (existedCate) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: "Danh mục đã tồn tại",
				});
			}
			const category = await Category.create(req.body);
			return res.status(StatusCodes.CREATED).json({
				message: "Thêm mới danh mục thành công",
				data: category,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}

	async edit(req, res) {
		try {
			const { error } = cateValidate.validate(req.body, { abortEarly: false });
			if (error) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: error.details.map((item) => item.message),
				});
			}
			const existedCate = await Category.findOne({ name: req.body.name });
			// console.log((existedCate._id).toString(), req.params.id);
			
			if (existedCate && (existedCate._id).toString() !== req.params.id) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: "Danh mục đã tồn tại",
				});
			}
			const category = await Category.findByIdAndUpdate(req.params.id, req.body);
			return res.status(StatusCodes.OK).json({
				message: "Cập nhật danh mục thành công",
				data: category,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}
}

export default CategoryController;
