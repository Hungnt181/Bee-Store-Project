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
            <li>
              <strong>- Hướng dẫn bảo quản:</strong>
              <li>Giặt tay hoặc giặt máy ở chế độ nhẹ với nước lạnh.</li>
              <li>Tránh sử dụng chất tẩy mạnh, không ngâm quá lâu.</li>
              <li>Tránh sử dụng chất tẩy mạnh, không ngâm quá lâu.</li>
            </li>
            <li>
              <strong>- Hướng dẫn giặt ủi:</strong>
              <li>
                Ủi ở nhiệt độ thấp để tránh làm hỏng chất liệu và giữ cho sản
                phẩm luôn phẳng đẹp.
              </li>
            </li>
            <li>
              <strong> - Lưu ý:</strong>
              <li>
                Hình ảnh chỉ mang tính chất minh họa, màu sắc sản phẩm thực tế
                có thể thay đổi tùy thuộc vào điều kiện ánh sáng và thiết bị
                hiển thị.
              </li>
            </li>
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
