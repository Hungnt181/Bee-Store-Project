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
          <ul className="text-base font-thin space-y-2 list-none">
            <li>
              <span className="font-medium">Màu sắc:</span>{" "}
              {colors?.map((item: Color) => item?.name).join(", ")}
            </li>
            <li>
              <span className="font-medium">Kích cỡ:</span>{" "}
              {sizes?.map((item: Size) => item?.name).join(", ")}
            </li>
            <li>
              <span className="font-medium">Mô tả:</span>{" "}
              {variants[0]?.id_product?.description}
            </li>

            <li>
              <span className="font-medium">Hướng dẫn bảo quản:</span>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Giặt tay hoặc giặt máy ở chế độ nhẹ với nước lạnh.</li>
                <li>Tránh sử dụng chất tẩy mạnh, không ngâm quá lâu.</li>
              </ul>
            </li>

            <li>
              <span className="font-medium">Hướng dẫn giặt ủi:</span>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>
                  Ủi ở nhiệt độ thấp để tránh làm hỏng chất liệu và giữ cho sản
                  phẩm luôn phẳng đẹp.
                </li>
              </ul>
            </li>

            <li>
              <span className="font-medium">Lưu ý:</span>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>
                  Hình ảnh chỉ mang tính chất minh họa, màu sắc sản phẩm thực tế
                  có thể thay đổi tùy thuộc vào điều kiện ánh sáng và thiết bị
                  hiển thị.
                </li>
              </ul>
            </li>
          </ul>
        ) : (
          <div className="font-thin min-h-32">
            <h3>
              🛠️ Chính Sách Bảo Hành –{" "}
              <strong className="font-medium">BeeStore</strong>
            </h3>

            <p>
              - Bảo hành trong <strong className="font-medium">3 ngày</strong>{" "}
              kể từ khi nhận hàng.
              <br />- Áp dụng cho lỗi{" "}
              <strong className="font-medium">sản xuất</strong>: rách nhẹ, bung
              chỉ, hỏng khóa kéo, cúc...
              <br />- <strong className="font-medium">
                Không bảo hành
              </strong>{" "}
              lỗi do người dùng (rách, cháy, dính màu…).
              <br />
              - Đổi mới nếu lỗi nặng và còn hàng.
              <br />- Gửi yêu cầu qua{" "}
              <strong className="font-medium">Fanpage</strong> hoặc Email:
              <a href="mailto:support@beestore.vn">
                <strong className="font-medium"> support@beestore.vn</strong>{" "}
              </a>
              <br />
              - Cung cấp ảnh lỗi + mã đơn hàng để được hỗ trợ nhanh nhất.
              <br />- <strong className="font-medium">BeeStore</strong> hỗ trợ
              phí vận chuyển tùy trường hợp.
              <br />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
