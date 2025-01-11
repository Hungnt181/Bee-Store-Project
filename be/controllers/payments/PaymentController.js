
import payment from "./models/payments/payment";
import { paymentJoi } from "./utils/validator/payment";

export const add = async (req, res) => {
    try {
        const { error } = paymentJoi.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map(err => err.message).join(", ") });
        }

        const data = await payment.create(req.body);
        res.status(200).json({ message: "Thêm phương thức thanh toán thành công", data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const list = async (req, res) => {
    try {
        const data = await payment.find();
        res.status(200).json({ message: "Danh sách phương thức thanh toán", data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const detail = async (req, res) => {
    try {
        const data = await payment.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy phương thức thanh toán" });
        }
        res.status(200).json({ message: "Chi tiết phương thức thanh toán", data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const remove = async (req, res) => {
    try {
        const data = await payment.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy phương thức thanh toán để xóa" });
        }
        res.status(200).json({ message: "Xóa phương thức thanh toán thành công", data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const edit = async (req, res) => {
    try {
        const { error } = paymentJoi.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map(err => err.message).join(", ") });
        }

        const data = await payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy phương thức thanh toán để cập nhật" });
        }

        res.status(200).json({ message: "Cập nhật phương thức thanh toán thành công", data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
