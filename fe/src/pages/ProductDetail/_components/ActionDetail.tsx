import { Button, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import { Variant } from "../../../interface/Variant";
import Color from "../../../interface/Color";
import Size from "../../../interface/Size";
import CartModalbox from "./CartModalbox";
import { useParams } from "react-router-dom";

interface ActionDetail {
  variants: Variant[];
  colors: Color[];
  sizes: Size[];
  newImage: (images: string[] | null) => void;
}

interface CartItemDetail {
  idProduct: string;
  idVariant: string;
  color: string;
  size: string;
  quantity: number;
}

export default function ActionDetail({
  variants,
  colors,
  sizes,
  newImage,
}: // onVariantChange,
ActionDetail) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeOfColor, setSizeOfColor] = useState<string[] | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [statusVariant, setStatusVariant] = useState(false);

  // const handleClickBuy = () => {
  //   // console.log(quantity);
  // };

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedColor(variants[0].id_color.name);
      setSelectedSize(variants[0].id_size.name);

      const isStopped = variants.every((variant) => variant.status === false);
      setStatusVariant(isStopped);
    }
  }, [variants]);

  // Xử lý vấn đề khi chọn xem pro => chuyển hướng nhận data của phần tử đầu => có màu cụ thể => select trực tiếp

  const handleSelectColor = (value: string) => {
    setSelectedColor(value);
    setSelectedSize(null); // Reset size khi đổi màu
  };

  // console.log("selectedColor", selectedColor);
  // console.log("selectedSize", selectedSize);

  // Lọc size theo màu
  const getSizesByColor = (variants: Variant[], selectedColor: string) => {
    setQuantity(1);
    return [
      ...new Set(
        variants
          .filter(
            (v: Variant) =>
              v.id_color.name === selectedColor &&
              v.quantity > 0 &&
              v.status === true
          )
          .map((v: Variant) => v.id_size.name)
      ),
    ];
  };

  useEffect(() => {
    if (selectedColor) {
      const sizes = getSizesByColor(variants, selectedColor);
      setSizeOfColor(sizes);
      // Nếu chỉ có 1 size, tự động chọn nó
      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      } else {
        setSelectedSize(null); // Reset nếu có nhiều size
      }
    }
  }, [selectedColor, variants]);

  // console.log("sizeOfColor", sizeOfColor);
  // handle Size
  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const selectedVariant = variants.find(
    (v) => v.id_color.name === selectedColor && v.id_size.name === selectedSize
  );
  useEffect(() => {
    if (selectedVariant) {
      newImage(selectedVariant.image || null); // Gửi ảnh lên component cha
    }
  }, [selectedVariant, newImage]);

  // console.log("Selected Variant:", selectedVariant?.id_size.name);

  //CART
  const [cartItems, setCartItems] = useState<CartItemDetail[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  let { id } = useParams();
  const handleClickBuy = () => {
    // Lấy các mặt hàng giỏ hàng từ localStorage
    const storedCartItems = localStorage.getItem("cartItems");
    const initialCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

    if (
      selectedVariant &&
      selectedVariant._id &&
      id &&
      selectedVariant.id_color.hexcode &&
      selectedVariant?.id_size.name
    ) {
      const newItem = {
        idProduct: id,
        idVariant: selectedVariant._id.toString(),
        color: selectedVariant.id_color.hexcode,
        size: selectedVariant?.id_size.name,
        quantity: quantity,
      };

      const existingItemIndex = initialCartItems.findIndex(
        (item: CartItemDetail) =>
          item.idProduct === newItem.idProduct &&
          item.idVariant === newItem.idVariant &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      let updatedCartItems;

      if (existingItemIndex !== -1) {
        const updatedItem = {
          ...initialCartItems[existingItemIndex],
          quantity:
            initialCartItems[existingItemIndex].quantity + newItem.quantity,
        };
        if (updatedItem.quantity > selectedVariant?.quantity) {
          updatedItem.quantity = selectedVariant?.quantity;
          message.warning(
            `Sản phẩm chỉ còn ${selectedVariant?.quantity} cái trong kho. Đã cập nhật lại số lượng tối đa.`
          );
        }

        updatedCartItems = [
          ...initialCartItems.slice(0, existingItemIndex),
          updatedItem,
          ...initialCartItems.slice(existingItemIndex + 1),
        ];
      } else {
        updatedCartItems = [...initialCartItems, newItem];
      }

      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      // setCartItems([])
    }
    setIsModalOpen(true);
  };
  // const handleCheckout = () => {
  //   console.log("checkout clicked");
  // }

  return (
    <div>
      {/* INFOR MATION PRODUCT */}
      <div>
        <div className="flex">
          <h3 className="uppercase text-xl font-normal mr-4">
            {variants[0]?.id_product?.name}
          </h3>
          <p className={`text-red-700 ${statusVariant ? "block " : "hidden"}`}>
            Sản phầm đã dừng bán
          </p>
        </div>

        <p className="font-thin text-base mt-1">
          Mã sản phẩm:{" "}
          <span className="uppercase">{variants[0]?.id_product?.slug}</span>
        </p>

        <p className="font-normal text-xl mt-1">
          Giá:{" "}
          <span className="uppercase">
            {variants[0]?.id_product?.price} VNĐ
          </span>
        </p>
      </div>

      {/* VARIANTS PRODUCT */}
      {/* COLORS */}
      <div className="mt-4">
        <p className="font-medium">Màu</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-2 mt-2">
            {colors.map((item: Color) => {
              // Kiểm tra xem có Variant nào thuộc màu này và có status === true không
              const isDisabled = !variants.some(
                (v) => v.id_color.name === item.name && v.status === true
              );

              return (
                <div
                  key={item.name} // Quan trọng để tránh lỗi key khi render danh sách
                  className={`border cursor-pointer transition-all duration-300
          ${item.name === selectedColor ? "border-b-black border-3" : ""}
          ${isDisabled ? "opacity-50 pointer-events-none" : ""}
        `}
                  style={{
                    marginLeft: "5px",
                    backgroundColor: item.hexcode,
                    width: "40px",
                    height: "40px",
                    borderRadius: item.name === selectedColor ? "10%" : "0px",
                  }}
                  onClick={() => !isDisabled && handleSelectColor(item.name)}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
      {/* SIZE */}
      <div className="mt-4">
        <p className="font-medium">Kích thước</p>
        <div className="flex items-center gap-2 mt-2">
          {sizes.map((item: Size) => {
            // Kiểm tra xem size này có hợp lệ không
            const isDisabled =
              !sizeOfColor?.includes(item.name) || // Nếu size không nằm trong danh sách hợp lệ của màu đã chọn
              !variants.some(
                (v) =>
                  v.id_color.name === selectedColor &&
                  v.id_size.name === item.name &&
                  v.status === true // Chỉ lấy những variant có trạng thái bán (status === true)
              );

            return (
              <div
                key={item.name} // Đảm bảo key duy nhất khi render danh sách
                className={`border flex justify-center items-center cursor-pointer w-10 h-10 
          transition-all duration-300 text-sm
          ${
            item.name === selectedSize
              ? "bg-black text-white"
              : "border-[#c0c0c0]"
          } 
          ${isDisabled ? "opacity-50 pointer-events-none" : ""}
        `}
                onClick={() => !isDisabled && handleSelectSize(item.name)}
              >
                <span className="uppercase">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* QUANTITY */}
      <div className="mt-4">
        <p>Số lượng</p>
        <div className="antd-custom mt-2 flex items-center gap-2">
          <Button
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            className="h-full"
            disabled={quantity === 1}
          >
            -
          </Button>
          <InputNumber
            min={1}
            defaultValue={1}
            value={quantity}
            className="flex items-center"
            controls={false}
          />
          <Button
            onClick={() => {
              if (
                quantity > 0 &&
                selectedVariant?.quantity !== undefined &&
                quantity + 1 <= selectedVariant.quantity
              ) {
                setQuantity(quantity + 1);
              }
            }}
            className=""
          >
            +
          </Button>
          <span className="ml-2">Sẵn có {selectedVariant?.quantity}</span>
        </div>
      </div>
      {/* BUTTON BUY */}
      <div className="mt-4">
        <button
          onClick={handleClickBuy}
          className="bg-black text-white uppercase cursor-pointer w-3/4 py-3.5 text-sm"
        >
          Đặt mua
        </button>
        <CartModalbox
          isOpen={isModalOpen}
          cartItems={cartItems}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
