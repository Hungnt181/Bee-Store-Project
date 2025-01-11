import Category from "../models/Category.js";
import cateValidate from "../utils/validator/cateValidators.js";

class CategoryController {
    async list(req, res) {
        try {
            const category = await Category.find();
            return res.status(200).json({
                message: "Lấy danh sách danh mục thành công",
                data: category
            })
        } catch (error) {
            return res.status(500).json({
                message: "something went wrong"
            })
        }
    }

    async detail(req, res) {
        try {
            const category = await Category.findById(req.params.id);
            return res.status(200).json({
                message: "Lấy chi tiết danh mục thành công",
                data: category
            })
        } catch (error) {
            return res.status(500).json({
                message: "something went wrong"
            })
        }
    }

    async create(req, res) {
        try {
            const { error } = cateValidate.validate(req.body, {abortEarly: false})
            if ( error ) {
                return res.status(400).json({
                    message: error.details.map(item => item.message)
                })
            }
            const category = await Category.create(req.body);
            return res.status(200).json({
                message: "Thêm mới danh mục thành công",
                data: category
            })
        } catch (error) {
            return res.status(500).json({
                message: "something went wrong"
            })
        }
    }

    async edit(req, res) {
        try {
            const { error } = cateValidate.validate(req.body, {abortEarly: false})
            if ( error ) {
                return res.status(400).json({
                    message: error.details.map(item => item.message)
                })
            }
            const category = await Category.findByIdAndUpdate(req.params.id, req.body);
            return res.status(200).json({
                message: "Cập nhật danh mục thành công",
                data: category
            })
        } catch (error) {
            return res.status(500).json({
                message: "something went wrong"
            })
        }
    }
}

export default CategoryController