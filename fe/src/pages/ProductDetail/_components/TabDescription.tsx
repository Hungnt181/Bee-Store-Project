import { useState } from "react";
import { Variant } from "../../../interface/Variant";
import Color from "../../../interface/Color";
import Size from "../../../interface/Size";

interface TabDescriptionProps {
  variants: Variant[];
  colors: Color[];
  sizes: Size[];
}

export default function TabDescription({
  variants,
  colors,
  sizes,
}: TabDescriptionProps) {
  const [tabIndex, setTabIndex] = useState<number>(0);
  return (
    <div className="mt-6 ">
      {/* TAB CONTROL */}
      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-lg">
        <div
          onClick={() => setTabIndex(0)}
          className={`w-full text-center py-3 cursor-pointer rounded-md transition-all duration-300 ${
            tabIndex === 0
              ? "bg-gray-500 text-white font-semibold shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-200"
          }`}
        >
          MÔ TẢ SẢN PHẨM
        </div>
        <div
          onClick={() => setTabIndex(1)}
          className={`w-full text-center py-3 cursor-pointer rounded-md transition-all duration-300 ${
            tabIndex === 1
              ? "bg-gray-500 text-white font-semibold shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-200"
          }`}
        >
          CHÍNH SÁCH BẢO HÀNH
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {tabIndex === 0 ? (
          <ul className="text-base  font-thin">
            <li>
              - Màu sắc: {colors?.map((item: Color) => item?.name).join(", ")}
            </li>
            <li>
              - Kích cỡ: {sizes?.map((item: Size) => item?.name).join(", ")}
            </li>
            <li>- Mô tả: {variants[0]?.id_product?.description}</li>
            {/* <li>
              - Form vừa vặn giúp người mặc dễ dàng vận động và tạo cảm giác
              thoải mái khi mặc.
            </li>
            <li>- Khóa kéo chắc chắn</li>
            <li>- Cổ tay áo bo chun vừa vặn</li> */}
          </ul>
        ) : (
          <div className="font-thin min-h-32">
            <p>- Đổi trả hàng trong vòng 3 ngày tính từ ngày nhận hàng</p>
          </div>
        )}
      </div>
    </div>
  );
}
