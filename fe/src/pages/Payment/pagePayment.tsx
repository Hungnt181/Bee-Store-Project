import { useState } from "react";
import { User, Phone, Mail, MapPin, Pencil, Tag, Lock } from "lucide-react";

interface Districts {
  [key: string]: string[];
}
//Tỉnh và Thành phố
const provinces = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];
//Quận và Huyện
const districts: Districts = {
  "Hà Nội": [
    "Ba Đình",
    "Hoàn Kiếm",
    "Hai Bà Trưng",
    "Đống Đa",
    "Tây Hồ",
    "Cầu Giấy",
    "Thanh Xuân",
    "Hoàng Mai",
    "Long Biên",
    "Nam Từ Liêm",
    "Bắc Từ Liêm",
    "Hà Đông",
    "Sóc Sơn",
    "Đông Anh",
    "Gia Lâm",
    "Thanh Trì",
    "Thường Tín",
    "Phú Xuyên",
    "Ứng Hòa",
    "Mỹ Đức",
    "Chương Mỹ",
    "Thanh Oai",
    "Thạch Thất",
    "Quốc Oai",
    "Ba Vì",
    "Phúc Thọ",
    "Đan Phượng",
    "Hoài Đức",
    "Mê Linh",
  ],
  "Hồ Chí Minh": [
    "Quận 1",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Bình Tân",
    "Tân Phú",
    "Gò Vấp",
    "Phú Nhuận",
    "Tân Bình",
    "Bình Thạnh",
    "Thủ Đức",
    "Bình Chánh",
    "Cần Giờ",
    "Củ Chi",
    "Hóc Môn",
    "Nhà Bè",
  ],
  "Đà Nẵng": [
    "Hải Châu",
    "Thanh Khê",
    "Sơn Trà",
    "Ngũ Hành Sơn",
    "Liên Chiểu",
    "Cẩm Lệ",
    "Hòa Vang",
    "Hoàng Sa",
  ],
  "Hải Phòng": [
    "Hồng Bàng",
    "Ngô Quyền",
    "Lê Chân",
    "Hải An",
    "Kiến An",
    "Đồ Sơn",
    "Dương Kinh",
    "Thủy Nguyên",
    "An Dương",
    "An Lão",
    "Kiến Thụy",
    "Tiên Lãng",
    "Vĩnh Bảo",
    "Cát Hải",
    "Bạch Long Vĩ",
  ],
  "Cần Thơ": [
    "Ninh Kiều",
    "Bình Thủy",
    "Cái Răng",
    "Ô Môn",
    "Thốt Nốt",
    "Phong Điền",
    "Cờ Đỏ",
    "Thới Lai",
    "Vĩnh Thạnh",
  ],
  "An Giang": [
    "Long Xuyên",
    "Châu Đốc",
    "Tân Châu",
    "An Phú",
    "Châu Phú",
    "Châu Thành",
    "Phú Tân",
    "Thoại Sơn",
    "Tri Tôn",
    "Tịnh Biên",
  ],
  "Bà Rịa - Vũng Tàu": [
    "Vũng Tàu",
    "Bà Rịa",
    "Châu Đức",
    "Côn Đảo",
    "Đất Đỏ",
    "Long Điền",
    "Tân Thành",
    "Xuyên Mộc",
  ],
  "Hà Giang": [
    "Hà Giang",
    "Bắc Mê",
    "Bắc Quang",
    "Đồng Văn",
    "Hoàng Su Phì",
    "Mèo Vạc",
    "Quản Bạ",
    "Quang Bình",
    "Vị Xuyên",
    "Xín Mần",
    "Yên Minh",
  ],
  "Hà Nam": [
    "Phủ Lý",
    "Bình Lục",
    "Duy Tiên",
    "Kim Bảng",
    "Lý Nhân",
    "Thanh Liêm",
  ],
  "Hà Tĩnh": [
    "Hà Tĩnh",
    "Hồng Lĩnh",
    "Kỳ Anh",
    "Cẩm Xuyên",
    "Can Lộc",
    "Đức Thọ",
    "Hương Khê",
    "Hương Sơn",
    "Lộc Hà",
    "Nghi Xuân",
    "Thạch Hà",
    "Vũ Quang",
  ],
  "Hải Dương": [
    "Hải Dương",
    "Chí Linh",
    "Cẩm Giàng",
    "Gia Lộc",
    "Kim Thành",
    "Kinh Môn",
    "Nam Sách",
    "Ninh Giang",
    "Thanh Hà",
    "Thanh Miện",
    "Tứ Kỳ",
    "Bình Giang",
  ],
  "Hậu Giang": [
    "Vị Thanh",
    "Ngã Bảy",
    "Châu Thành",
    "Châu Thành A",
    "Long Mỹ",
    "Phụng Hiệp",
    "Vị Thủy",
  ],
  "Hòa Bình": [
    "Hòa Bình",
    "Cao Phong",
    "Đà Bắc",
    "Kim Bôi",
    "Kỳ Sơn",
    "Lạc Sơn",
    "Lạc Thủy",
    "Lương Sơn",
    "Mai Châu",
    "Tân Lạc",
    "Yên Thủy",
  ],
  "Hưng Yên": [
    "Hưng Yên",
    "Ân Thi",
    "Khoái Châu",
    "Kim Động",
    "Mỹ Hào",
    "Phù Cừ",
    "Tiên Lữ",
    "Văn Giang",
    "Văn Lâm",
    "Yên Mỹ",
  ],
  "Khánh Hòa": [
    "Nha Trang",
    "Cam Ranh",
    "Ninh Hòa",
    "Vạn Ninh",
    "Diên Khánh",
    "Khánh Sơn",
    "Khánh Vĩnh",
    "Trường Sa",
  ],
  "Kiên Giang": [
    "Rạch Giá",
    "Hà Tiên",
    "An Biên",
    "An Minh",
    "Châu Thành",
    "Giang Thành",
    "Giồng Riềng",
    "Gò Quao",
    "Hòn Đất",
    "Kiên Hải",
    "Kiên Lương",
    "Tân Hiệp",
    "U Minh Thượng",
    "Vĩnh Thuận",
    "Phú Quốc",
  ],
  "Kon Tum": [
    "Kon Tum",
    "Đắk Glei",
    "Đắk Hà",
    "Đắk Tô",
    "Ia H’Drai",
    "Kon Plông",
    "Kon Rẫy",
    "Ngọc Hồi",
    "Sa Thầy",
    "Tu Mơ Rông",
  ],
  "Lai Châu": [
    "Lai Châu",
    "Mường Tè",
    "Nậm Nhùn",
    "Phong Thổ",
    "Sìn Hồ",
    "Tam Đường",
    "Tân Uyên",
    "Than Uyên",
  ],
  "Lâm Đồng": [
    "Đà Lạt",
    "Bảo Lộc",
    "Bảo Lâm",
    "Cát Tiên",
    "Đạ Huoai",
    "Đạ Tẻh",
    "Đam Rông",
    "Di Linh",
    "Đơn Dương",
    "Đức Trọng",
    "Lạc Dương",
    "Lâm Hà",
  ],
  "Lạng Sơn": [
    "Lạng Sơn",
    "Bắc Sơn",
    "Bình Gia",
    "Cao Lộc",
    "Chi Lăng",
    "Đình Lập",
    "Hữu Lũng",
    "Lộc Bình",
    "Tràng Định",
    "Văn Lãng",
    "Văn Quan",
  ],
  "Lào Cai": [
    "Lào Cai",
    "Bát Xát",
    "Bảo Thắng",
    "Bảo Yên",
    "Bắc Hà",
    "Mường Khương",
    "Sa Pa",
    "Si Ma Cai",
    "Văn Bàn",
  ],
  "Long An": [
    "Tân An",
    "Bến Lức",
    "Cần Đước",
    "Cần Giuộc",
    "Châu Thành",
    "Đức Hòa",
    "Đức Huệ",
    "Mộc Hóa",
    "Tân Hưng",
    "Tân Thạnh",
    "Tân Trụ",
    "Thạnh Hóa",
    "Thủ Thừa",
    "Vĩnh Hưng",
  ],
  "Nam Định": [
    "Nam Định",
    "Giao Thủy",
    "Hải Hậu",
    "Mỹ Lộc",
    "Nam Trực",
    "Nghĩa Hưng",
    "Trực Ninh",
    "Vụ Bản",
    "Xuân Trường",
    "Ý Yên",
  ],
  "Nghệ An": [
    "Vinh",
    "Cửa Lò",
    "Hoàng Mai",
    "Thái Hòa",
    "Anh Sơn",
    "Con Cuông",
    "Diễn Châu",
    "Đô Lương",
    "Hưng Nguyên",
    "Kỳ Sơn",
    "Nam Đàn",
    "Nghi Lộc",
    "Nghĩa Đàn",
    "Quế Phong",
    "Quỳ Châu",
    "Quỳ Hợp",
    "Quỳnh Lưu",
    "Tân Kỳ",
    "Thanh Chương",
    "Tương Dương",
    "Yên Thành",
  ],
  "Ninh Bình": [
    "Ninh Bình",
    "Tam Điệp",
    "Gia Viễn",
    "Hoa Lư",
    "Kim Sơn",
    "Nho Quan",
    "Yên Khánh",
    "Yên Mô",
  ],
  "Ninh Thuận": [
    "Phan Rang - Tháp Chàm",
    "Bác Ái",
    "Ninh Hải",
    "Ninh Phước",
    "Ninh Sơn",
    "Thuận Bắc",
    "Thuận Nam",
  ],
  "Phú Thọ": [
    "Việt Trì",
    "Phú Thọ",
    "Cẩm Khê",
    "Đoan Hùng",
    "Hạ Hòa",
    "Lâm Thao",
    "Tam Nông",
    "Tân Sơn",
    "Thanh Ba",
    "Thanh Sơn",
    "Thanh Thủy",
    "Yên Lập",
  ],
  "Phú Yên": [
    "Tuy Hòa",
    "Sông Cầu",
    "Đồng Xuân",
    "Sơn Hòa",
    "Sông Hinh",
    "Tây Hòa",
    "Tuy An",
    "Phú Hòa",
    "Đông Hòa",
  ],
  "Quảng Bình": [
    "Đồng Hới",
    "Ba Đồn",
    "Bố Trạch",
    "Lệ Thủy",
    "Minh Hóa",
    "Quảng Ninh",
    "Quảng Trạch",
    "Tuyên Hóa",
  ],
  "Quảng Nam": [
    "Tam Kỳ",
    "Hội An",
    "Bắc Trà My",
    "Đại Lộc",
    "Điện Bàn",
    "Duy Xuyên",
    "Hiệp Đức",
    "Nam Giang",
    "Nam Trà My",
    "Nông Sơn",
    "Núi Thành",
    "Phú Ninh",
    "Phước Sơn",
    "Quế Sơn",
    "Tây Giang",
    "Thăng Bình",
    "Tiên Phước",
  ],
  "Quảng Ngãi": [
    "Quảng Ngãi",
    "Ba Tơ",
    "Bình Sơn",
    "Đức Phổ",
    "Lý Sơn",
    "Minh Long",
    "Mộ Đức",
    "Nghĩa Hành",
    "Sơn Hà",
    "Sơn Tây",
    "Sơn Tịnh",
    "Tây Trà",
    "Trà Bồng",
    "Tư Nghĩa",
  ],
};

const PaymentPage = () => {
  const [quantity] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string>("cod"); // Mặc định chọn "cod"

  const orders = [
    {
      id: 1,
      name: "CHACO J105375 - ĐEN - 8",
      code: "J105375-8",
      oldPrice: 2290000,
      newPrice: 1900000,
      image: "https://picsum.photos/100/100",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-7xl">
        {/* Thông tin sản phẩm */}
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
          Thông tin sản phẩm
        </h2>
        <div className="border border-gray-300 p-4 mb-6 rounded-lg bg-gray-50">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex gap-4 mb-4 border-b border-gray-300 pb-4 last:border-b-0"
            >
              <img
                src={order.image}
                alt={order.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold">{order.name}</p>
                <p className="text-sm text-gray-600">
                  Mã sản phẩm: {order.code}
                </p>
                <p className="line-through text-gray-500">
                  {order.oldPrice.toLocaleString()} đ
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-lg font-semibold text-black-500">
                    {order.newPrice.toLocaleString()} đ
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-12  p-1 rounded-md text-center">
                      x {quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thông tin người nhận */}
        <div className="grid gap-3 mb-6">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
            Người nhận
          </h2>
          <div className="relative w-full">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Tên khách hàng"
              className="border border-gray-300 p-3 pl-10 rounded w-full 
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
            />
          </div>
          <div className="relative w-full">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border border-gray-300 p-3 pl-10 rounded w-full
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
            />
          </div>
          <div className="relative w-full">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Địa chỉ email (không bắt buộc)"
              className="border border-gray-300 p-3 pl-10 rounded w-full
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="province" className="sr-only">
              Chọn tỉnh/thành
            </label>
            <select
              id="province"
              className="border border-gray-300 p-3 rounded flex-1"
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedDistrict(""); // Reset quận/huyện khi chọn tỉnh mới
              }}
              value={selectedProvince}
              aria-label="Chọn tỉnh/thành"
            >
              <option value="">Chọn Tỉnh/Thành Phố</option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>

            <label htmlFor="district" className="sr-only">
              Chọn quận/huyện
            </label>
            <select
              id="district"
              className="border border-gray-300 p-3 rounded flex-1"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              aria-label="Chọn quận/huyện"
              disabled={!selectedProvince} // Disable khi chưa chọn tỉnh/thành
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts[selectedProvince]?.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Nhập địa chỉ cụ thể"
              className="border border-gray-300 p-3 pl-10 rounded w-full
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
            />
          </div>
          <div className="relative w-full">
            <Pencil className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Nhập ghi chú (không bắt buộc)"
              className="border border-gray-300 p-3 pl-10 rounded w-full
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>
        {/* Phuong thức thanh toán */}
        <div>
          <h2 className="text-2xl font-semibold">Phương thức thanh toán</h2>
          <h2 className="mb-4 border-b border-gray-300 text-gray-400 pb-2">
            Lựa chọn phương thức thanh toán phù hợp nhất cho bạn
          </h2>

          <label className="flex items-center gap-2 mb-6">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              value="cod"
              checked={selectedPayment === "cod"}
              onChange={() => setSelectedPayment("cod")}
            />
            Thanh toán khi nhận hàng
          </label>

          <label className="flex items-center gap-2 mb-6">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              value="bank"
              checked={selectedPayment === "bank"}
              onChange={() => setSelectedPayment("bank")}
            />
            Thanh toán qua ví điện tử VNPAY
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Thanh toán */}
          <div className="flex-1 border border-gray-300 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Thanh toán</h3>
            <p className="flex justify-between text-gray-500">
              Tổng giá trị sản phẩm <span>1,900,000 đ</span>
            </p>
            <p className="flex justify-between text-gray-500">
              Giảm giá <span>0 đ</span>
            </p>
            <p className="flex justify-between text-gray-500">
              Vận chuyển <span>20,000 đ</span>
            </p>
            <p className="flex justify-between border-b border-gray-300 text-gray-500 pb-2">
              Giảm giá vận chuyển{" "}
              <span className="text-red-500">- 20,000 đ</span>
            </p>
            <p className="flex justify-between text-lg font-semibold text-red-500  pt-2 ">
              Tổng thanh toán{" "}
              <span className="text-xl font-bold">1,900,000 đ</span>
            </p>
            <p className="text-right text-red-500">
              Bạn đã tiết kiệm được <span>20,000 đ</span>
            </p>
          </div>
          {/* Giảm giá */}
          <div className="w-full md:w-1/3 border border-gray-300 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Mã giảm giá</h3>
            <div className="relative w-full">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="border border-gray-300 p-3 pl-10 rounded w-full mb-2
                focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
              />
            </div>
            <button
              className="bg-black text-white px-4 py-2 w-full rounded 
                   hover:bg-yellow-500 transition duration-300"
            >
              Áp dụng
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" className="w-4 h-4" /> Đồng ý với các điều
          khoản và quy định của website
        </label>
        <button
          className="bg-black text-white px-6 py-3 w-full mt-4 rounded-lg text-lg font-semibold 
                   hover:bg-yellow-500 transition duration-300"
        >
          ĐẶT HÀNG
        </button>
        <h5 className="text-center pt-2 flex items-center justify-center gap-2 text-gray-700">
          <Lock className="w-5 h-5 text-green-600" />
          Đảm bảo thanh toán an toàn và bảo mật
        </h5>
      </div>
    </div>
  );
};

export default PaymentPage;
