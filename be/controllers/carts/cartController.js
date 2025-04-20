
import Cart from "../../models/carts/cartModel.js";
import StatusCodes from "http-status-codes";


// Lấy danh sách giỏ hàng theo idUser
export const getCartByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    if (!idUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Thiếu thông tin idUser.",
      });
    }
    const cart = await Cart.findOne({ idUser });
    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi: " + error.message,
    });
  }
};

// Tạo mới sản phẩm trong giỏ hàng
export const createCart = async (req, res) => {
  try {
    const { idUser } = req.params;
    if (!idUser) {
      return res.status(400).json({ message: "idUser là bắt buộc." });
    }
    //mỗi ng dùng chỉ có 1 cart
    const existingCart = await Cart.findOne({ idUser });
    if (existingCart) {
      return res.status(400).json({ message: "Tạo cart thất bại" });
    }
    const newCart = new Cart({
      items: [],
      idUser: idUser,
    });
    await newCart.save();
    return res.status(201).json({ message: "Giỏ hàng được tạo thành công.", data: newCart });
  } catch (error) {
    return res.status(400).json({ message: "Tạo cart thất bại", error: error.message });
  }
};

// Cập nhật giỏ hàng
export const updateCart = async (req, res) => {
  try {
    const { idUser } = req.params;
    if (!idUser) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng." });
    }
    if (!Array.isArray(req.body) || req.body.length == 0) {
      return res.status(400).json({ message: "không phải mảng hoặc rỗng." });
    }

    const cart = await Cart.findOne({ idUser });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại cho người dùng này." });
    }

    req.body.forEach(({ idVariant, quantity }) => {
      if (!idVariant || quantity == undefined || quantity <= 0) {
        throw new Error("thiếu `idVariant` hoặc `quantity` không hợp lệ.");
      }

      const existingItem = cart.items.find(item => item.idVariant.toString() == idVariant);
      if (existingItem) {
        existingItem.quantity += quantity; 
      } else {
        cart.items.push({ idVariant, quantity });
      }
    });

    await cart.save();

    return res.status(200).json({
      message: "Cập nhật giỏ hàng thành công.",
      data: cart,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error.message);
    return res.status(400).json({ message: "Cập nhật giỏ hàng thất bại.", error: error.message });
  }
};