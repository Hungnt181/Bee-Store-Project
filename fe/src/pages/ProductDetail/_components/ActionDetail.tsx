import { Button, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import { Variant } from "../../../interface/Variant";
import Color from "../../../interface/Color";
import Size from "../../../interface/Size";
import CartModalbox from "./CartModalbox";
import { useParams } from "react-router-dom";
import { Modal, Tabs } from "antd";
interface SizeChartProps {
  isVisible: boolean;
  onClose: () => void;
}

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
  nameColor: string;
  quantity: number;
}
const SizeChart = ({ isVisible, onClose }: SizeChartProps) => {
  const { TabPane } = Tabs;

  return (
    <Modal
      title={
        <h2 className="text-xl font-semibold text-center text-gray-800 mt-2">
          Bảng Kích Thước
        </h2>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 40 }}
      styles={{ body: { padding: 10 } }}
      closeIcon={
        <span className="text-xl hover:text-gray-700 transition-colors">×</span>
      }
    >
      <Tabs
        defaultActiveKey="1"
        className="size-chart-tabs"
        tabBarStyle={{
          marginBottom: "20px",
          borderBottom: "2px solid #f0f0f0",
        }}
      >
        <TabPane
          tab={<span className="text-base font-medium px-4">Nam</span>}
          key="1"
        >
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-l-4 border-blue-500 pl-3">
              Áo Nam
            </h3>
            <div className="overflow-x-auto rounded-lg shadow max-h-64 overflow-y-auto">
              <table className="min-w-full border-collapse bg-white">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-blue-50">
                    <th className="border border-gray-200 p-2 text-left font-semibold text-gray-700">
                      Kích thước
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      S
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      M
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      L
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      XL
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      2XL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Chiều cao (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      160-165
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      160-165
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      166-172
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      172-177
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      177-184
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Cân nặng (kg)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      50-54
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      55-61
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      62-68
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      69-75
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      76-84
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Rộng vai (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      41
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      42
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      43,5
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      45
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      46,5
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Vòng ngực (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      82-86
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      86-90
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      90-94
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      94-98
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      98-102
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-l-4 border-blue-500 pl-3">
              Quần Nam
            </h3>
            <div className="overflow-x-auto rounded-lg shadow max-h-64 overflow-y-auto">
              <table className="min-w-full border-collapse bg-white">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-blue-50">
                    <th className="border border-gray-200 p-2 text-left font-semibold text-gray-700">
                      Kích thước
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      S/28
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      M/29
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      L/30
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      XL/31
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      2XL/32
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Chiều cao (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      160-165
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      160-165
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      166-172
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      172-177
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      177-184
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Cân nặng (kg)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      50-54
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      55-61
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      62-68
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      69-75
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      76-84
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Vòng bụng (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      68-72
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      72-76
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      76-80
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      80-84
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      84-88
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Vòng mông (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      84-88
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      88-92
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      92-95
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      95-98
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      98-101
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={<span className="text-base font-medium px-4 ">Nữ</span>}
          key="2"
        >
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-l-4 border-pink-500 pl-3">
              Áo Nữ
            </h3>
            <div className="overflow-x-auto rounded-lg shadow max-h-64 overflow-y-auto">
              <table className="min-w-full border-collapse bg-white">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-pink-50">
                    <th className="border border-gray-200 p-2 text-left font-semibold text-gray-700">
                      Kích thước
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      S
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      M
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      L
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      XL
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      2XL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Chiều cao (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      150-155
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      155-160
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      160-165
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      165-170
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      170-175
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Cân nặng (kg)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      40-45
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      45-50
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      50-55
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      55-60
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      60-65
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Vòng ngực (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      78-82
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      82-86
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      86-90
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      90-94
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      94-98
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Vòng eo (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      64-68
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      68-72
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      72-76
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      76-80
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      80-84
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-l-4 border-pink-500 pl-3">
              Quần Nữ
            </h3>
            <div className="overflow-x-auto rounded-lg shadow max-h-64 overflow-y-auto">
              <table className="min-w-full border-collapse bg-white">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-pink-50">
                    <th className="border border-gray-200 p-2 text-left font-semibold text-gray-700">
                      Kích thước
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      S/26
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      M/27
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      L/28
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      XL/29
                    </th>
                    <th className="border border-gray-200 p-2 text-center font-semibold text-gray-700">
                      2XL/30
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Chiều cao (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      150-155
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      155-160
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      160-165
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      165-170
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      170-175
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Cân nặng (kg)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      40-45
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      45-50
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      50-55
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      55-60
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      60-65
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Vòng eo (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      64-68
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      68-72
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      72-76
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      76-80
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      80-84
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">
                      Vòng hông (cm)
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      86-90
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      90-94
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      94-98
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      98-102
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      102-106
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Lưu ý:</span> Bảng kích thước trên chỉ
          mang tính tham khảo. Vui lòng chọn size phù hợp dựa trên số đo của
          bạn.
        </p>
      </div>
    </Modal>
  );
};
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
  const [quantityVariant, setQuantityVariant] = useState(false);
  const [isSizeChartVisible, setIsSizeChartVisible] = useState(false);
  // const handleClickBuy = () => {
  //   // console.log(quantity);
  // };

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedColor(variants[0].id_color.name);
      setSelectedSize(variants[0].id_size.name);

      const isStopped = variants.every((variant) => variant.status === false);
      setStatusVariant(isStopped);
      const isStock = variants.every((variant) => variant.quantity === 0);
      setQuantityVariant(isStock);

      const isOutOfStock = variants.every(
        (v) => v.status !== true || v.quantity === 0
      );
      setQuantityVariant(isOutOfStock);
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
  const { id } = useParams();
  const handleClickBuy = () => {
    // Lấy các mặt hàng giỏ hàng từ localStorage
    const storedCartItems = localStorage.getItem("cartItems");
    const initialCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

    if (
      selectedVariant &&
      selectedVariant._id &&
      id &&
      selectedVariant.id_color.hexcode &&
      selectedVariant.id_color.name &&
      selectedVariant?.id_size.name
    ) {
      const newItem = {
        idProduct: id,
        idVariant: selectedVariant._id.toString(),
        color: selectedVariant.id_color.hexcode,
        nameColor: selectedVariant.id_color.name,
        size: selectedVariant?.id_size.name,
        quantity: quantity,
      };

      const existingItemIndex = initialCartItems.findIndex(
        (item: CartItemDetail) =>
          item.idProduct === newItem.idProduct &&
          item.idVariant === newItem.idVariant &&
          item.color === newItem.color &&
          item.nameColor === newItem.nameColor &&
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
    message.success("Thêm sản phẩm thành công", 3);
    // setIsModalOpen(true);
  };
  // const handleCheckout = () => {
  //   console.log("checkout clicked");
  // }

  return (
    <div>
      {/* INFOR MATION PRODUCT */}
      <div className="space-y-3 ml-3">
        {/* Tên sản phẩm + trạng thái */}
        <div className="flex items-center gap-4 ">
          <h3 className="uppercase text-2xl font-semibold text-gray-900">
            {variants[0]?.id_product?.name}
          </h3>
          <p className={`text-red-700 ${statusVariant ? "block " : "hidden"}`}>
            Sản phầm đã dừng bán
          </p>
          <p
            className={`text-red-700 ${
              quantityVariant && !statusVariant ? "block " : "hidden"
            }`}
          >
            Hết hàng
          </p>
        </div>

        {/* Mã sản phẩm */}
        <p className="text-gray-600 text-base ">
          MSP:{" "}
          <span className="uppercase font-medium text-gray-500">
            {variants[0]?.id_product?.slug}
          </span>
        </p>

        {/* Giá sản phẩm */}

        <span className="text-2xl font-bold text-red-600">
          {Number(variants[0]?.id_product?.price).toLocaleString("vi-VN")} VNĐ
        </span>
      </div>

      {/* VARIANTS PRODUCT */}
      {/* COLORS */}
      <div className="mt-6 ml-3">
        <p className="font-medium text-gray-800">Màu sắc</p>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {colors.map((item: Color) => {
            // Kiểm tra xem có Variant nào thuộc màu này và có status === true không
            const isDisabled = !variants.some(
              (v) => v.id_color.name === item.name && v.status === true
            );

            return (
              <div
                key={item._id || item.name} // Sử dụng _id nếu có, nếu không thì dùng name
                className={`
            relative
            cursor-pointer
            transition-all
            duration-200
            ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
          `}
                onClick={() => !isDisabled && handleSelectColor(item.name)}
              >
                <div
                  style={{
                    backgroundColor: item.hexcode,
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                  }}
                  className={`
              border
              ${
                item.name === selectedColor
                  ? "ring-2 ring-gray-500 shadow-lg"
                  : "border-gray-200 shadow-sm hover:shadow"
              }
            `}
                />
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-30 rounded-lg">
                    <span className="text-red-600 font-bold text-lg">✕</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* SIZE */}
      <div className="mt-4 ml-3">
        {/* Tiêu đề và nút bảng kích thước */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium text-gray-900 text-base">Kích thước</p>
          <button
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full"
            onClick={() => setIsSizeChartVisible(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Bảng kích thước
          </button>
        </div>

        {/* Danh sách kích thước */}
        <div className="flex flex-wrap gap-2 mt-2">
          {sizes.map((item) => {
            // Kiểm tra xem size này có hợp lệ không
            const isDisabled =
              !sizeOfColor?.includes(item.name) ||
              !variants.some(
                (v) =>
                  v.id_color.name === selectedColor &&
                  v.id_size.name === item.name &&
                  v.status === true
              );

            return (
              <div
                key={item.name}
                className={`flex justify-center items-center w-10 h-10 rounded-md
              text-sm font-medium uppercase cursor-pointer transition-all duration-300
              ${
                item.name === selectedSize
                  ? "bg-gray-700 text-white shadow-md scale-105"
                  : "border border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-100 hover:scale-95"
              }
              ${
                isDisabled ? "opacity-50 pointer-events-none bg-gray-200" : ""
              }`}
                onClick={() => !isDisabled && handleSelectSize(item.name)}
              >
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* Size Chart Modal */}
        <SizeChart
          isVisible={isSizeChartVisible}
          onClose={() => setIsSizeChartVisible(false)}
        />
      </div>

      {/* QUANTITY */}
      <div className="mt-6 ml-3">
        <p className="font-medium text-gray-900">Số lượng</p>
        <div className="flex flex-wrap items-center gap-4">
          {/* Quantity Controls with Premium Styling */}
          <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
            <Button
              onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
              disabled={quantity === 1}
              className="flex items-center justify-center w-12 h-full transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-0"
              style={{
                border: "none",
                boxShadow: "none",
                borderRight: "1px solid #f0f0f0",
              }}
            >
              <span
                className={`text-lg ${
                  quantity === 1 ? "text-gray-400" : "text-gray-800"
                }`}
              >
                −
              </span>
            </Button>

            <InputNumber
              min={1}
              max={selectedVariant?.quantity}
              value={quantity}
              controls={false}
              precision={0}
              className="w-14 h-full text-center"
              style={{
                width: `${Math.max(quantity.toString().length * 12, 60)}px`,
                minWidth: "40px",
                border: "none",
                boxShadow: "none",
                fontSize: "15px",
                textAlign: "center",
                lineHeight: "normal",
              }}
              onChange={(value) => setQuantity(value || 1)}
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
              disabled={
                !selectedVariant || quantity >= (selectedVariant?.quantity || 0)
              }
              className="flex items-center justify-center w-12 h-full transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-0"
              style={{
                border: "none",
                boxShadow: "none",
                borderLeft: "1px solid #f0f0f0",
              }}
            >
              <span
                className={`text-lg ${
                  !selectedVariant ||
                  quantity >= (selectedVariant?.quantity || 0)
                    ? "text-gray-400"
                    : "text-gray-800"
                }`}
              >
                +
              </span>
            </Button>
          </div>

          {/* Availability Indicator with Status */}
          <div
            className={`flex items-center py-1.5 px-3 rounded-full text-sm ${
              selectedVariant?.quantity === 0
                ? "bg-red-50 text-red-700"
                : selectedVariant?.quantity && selectedVariant.quantity < 5
                ? "bg-amber-50 text-amber-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {selectedVariant?.quantity === 0 ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></div>
                <span>Hết hàng</span>
              </>
            ) : selectedVariant?.quantity && selectedVariant.quantity < 5 ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></div>
                <span>Sắp hết ({selectedVariant.quantity})</span>
              </>
            ) : (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                <span>Còn {selectedVariant?.quantity || 0} sản phẩm</span>
              </>
            )}
          </div>
        </div>

        {/* Low Stock Notice */}
        {selectedVariant &&
          selectedVariant.quantity > 0 &&
          selectedVariant.quantity < 10 && (
            <div className="flex items-start mt-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="ml-2 text-sm text-amber-700">
                Sản phẩm này đang bán chạy! Chỉ còn {selectedVariant.quantity}{" "}
                sản phẩm trong kho.
              </p>
            </div>
          )}
      </div>
      {/* BUTTON BUY */}
      <div className="mt-6 ml-3">
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={handleClickBuy}
            className="
        bg-black text-white uppercase 
        px-6 py-3.5 text-sm font-medium
        rounded-md shadow-md
        transition-all duration-300 ease-in-out
        w-full
        hover:bg-yellow-600 hover:shadow-lg hover:scale-105
        active:scale-95
        flex items-center justify-center gap-2
      "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Thêm vào giỏ hàng
          </button>
        </div>

        {/* Maintain the cart modal */}
        <CartModalbox
          isOpen={isModalOpen}
          cartItems={cartItems}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
