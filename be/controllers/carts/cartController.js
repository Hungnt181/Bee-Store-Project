
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

export const updateCart = async (req, res) => {
  try {
    const { idUser } = req.params;
    if (!idUser) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng." });
    }

    const cart = await Cart.findOne({ idUser });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại cho người dùng này." });
    }

    req.body.forEach(({ idProduct, idVariant, color, nameColor, size, quantity }) => {
      // Kiểm tra tính hợp lệ của từng phần tử
      if (!idProduct || !idVariant || typeof quantity !== 'number' || quantity <= 0) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ: thiếu `idProduct`, `idVariant`, hoặc `quantity` không chính xác.");
      }

      const existingItem = cart.items.find(
        (item) =>
          item.idProduct.toString() == idProduct &&
          item.idVariant.toString() == idVariant &&
          item.color == color &&
          item.nameColor == nameColor &&
          item.size == size
      );

      if (existingItem) {
        // Cập nhật số lượng nếu sản phẩm đã tồn tại
        existingItem.quantity += quantity;
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        cart.items.push({ idProduct, idVariant, color, nameColor, size, quantity });
      }
    });

    await cart.save();

    return res.status(200).json({
      message: "Cập nhật giỏ hàng thành công.",
      data: cart,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error.message);
    return res.status(500).json({
      message: "Cập nhật giỏ hàng thất bại.",
      error: error.message,
    });
  }
};

export const updateCart2 = async (req, res) => {
  try {
    const { idUser } = req.params;
    if (!idUser) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng." });
    }

    const cart = await Cart.findOne({ idUser });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại cho người dùng này." });
    }

    req.body.forEach(({ idProduct, idVariant, color, nameColor, size, quantity }) => {
      // Kiểm tra tính hợp lệ của từng phần tử
      if (!idProduct || !idVariant || typeof quantity !== 'number' || quantity <= 0) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ: thiếu `idProduct`, `idVariant`, hoặc `quantity` không chính xác.");
      }
      const existingItem = cart.items.find(
        (item) =>
          item.idProduct.toString() == idProduct &&
          item.idVariant.toString() == idVariant &&
          item.color == color &&
          item.nameColor == nameColor &&
          item.size == size
      );

      if (existingItem) {
        // Cập nhật số lượng nếu sản phẩm đã tồn tại
        existingItem.quantity = quantity;
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        cart.items.push({ idProduct, idVariant, color, nameColor, size, quantity });
      }
    });

    await cart.save();

    return res.status(200).json({
      message: "Cập nhật giỏ hàng thành công.",
      data: cart,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error.message);
    return res.status(500).json({
      message: "Cập nhật giỏ hàng thất bại.",
      error: error.message,
    });
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const { idUser, idVariant } = req.params;
    const { quantity } = req.body; 

    if (!idUser || !idVariant) {
      return res.status(400).json({ message: "Thiếu thông tin idUser hoặc idVariant." });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng phải là một số lớn hơn 0." });
    }
    const cart = await Cart.findOne({ idUser });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại cho người dùng này." });
    }
    const item = cart.items.find(item => item.idVariant.toString() === idVariant);
    if (!item) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({
      message: "Cập nhật số lượng sản phẩm thành công.",
      data: cart,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng sản phẩm:", error.message);
    return res.status(500).json({
      message: "Cập nhật số lượng sản phẩm thất bại.",
      error: error.message,
    });
  }
};


export const deleteCartItem = async (req, res) => {
  try {
    const { idUser, idVariant } = req.params;
    if (!idUser) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng." });
    }
    if (!idVariant) {
      return res.status(400).json({ message: "Thiếu thông tin idVariant." });
    }
    const cart = await Cart.findOne({ idUser });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại cho người dùng này." });
    }
    const updatedItems = cart.items.filter(item => item.idVariant.toString() !== idVariant);
    if (updatedItems.length == cart.items.length) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm cần xóa trong giỏ hàng." });
    }
    cart.items = updatedItems;
    await cart.save();
    return res.status(200).json({
      message: "Xóa sản phẩm thành công.",
      data: cart,
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error.message);
    return res.status(500).json({
      message: "Xóa sản phẩm thất bại.",
      error: error.message,
    });
  }
};