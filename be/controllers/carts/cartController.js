
import Cart from "../../models/carts/cartModel.js";
import StatusCodes from "http-status-codes";
import { cartJoi } from "../../utils/validator/cart.js";

// Lấy danh sách giỏ hàng theo idUser
export const getCartByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const carts = await Cart.find({ idUser }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách giỏ hàng thành công",
      data: carts,
    });
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server: " + error.message,
    });
  }
};

// Tạo mới sản phẩm trong giỏ hàng
export const createCart = async (req, res) => {
  try {
    const { error } = cartJoi.validate(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }

    const { idVariant, idUser, quantity } = req.body;

    // Kiểm tra nếu sản phẩm đã có trong giỏ -> cộng dồn số lượng
    const existingCart = await Cart.findOne({ idVariant, idUser });
    if (existingCart) {
      existingCart.quantity += quantity;
      await existingCart.save();
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật số lượng sản phẩm trong giỏ hàng",
        data: existingCart,
      });
    }

    const newCart = await Cart.create({ idVariant, idUser, quantity });
    res.status(StatusCodes.CREATED).json({
      message: "Thêm vào giỏ hàng thành công",
      data: newCart,
    });
  } catch (error) {
    console.error("Lỗi tạo giỏ hàng:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server: " + error.message,
    });
  }
};

// Cập nhật số lượng trong giỏ hàng
export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Số lượng phải lớn hơn 0",
      });
    }

    const cartItem = await Cart.findById(id);
    if (!cartItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Sản phẩm trong giỏ không tồn tại",
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(StatusCodes.OK).json({
      message: "Cập nhật số lượng thành công",
      data: cartItem,
    });
  } catch (error) {
    console.error("Lỗi cập nhật giỏ hàng:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi server: " + error.message,
    });
  }
};
