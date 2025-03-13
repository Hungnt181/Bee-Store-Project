import { useEffect, useState } from "react";
import { User, Phone, Mail, MapPin, Pencil, Tag, Lock } from "lucide-react";
import axios from "axios";

interface Districts {
  [key: string]: string[];
}

interface CartItemDetail {
  idProduct: string,
  idVariant: string,
  color: string,
  size: string,
  quantity: number,
}
interface ItemCheckout {
  nameProduct: string,
  imgVariant: string,
  price: number,
  color: string,
  size: string,
  quantity: number,
  totalPrice: number,
}


//Tỉnh và Thành phố
const provinces = [
  "Hà Nội",
  "Hồ Chí Minh",
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
};


const PaymentPage = () => {
  const [quantity] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string>("cod"); // Mặc định chọn "cod"

  const [cartItems, setCartItems] = useState<CartItemDetail[]>([]);
  const [listCheckout, setListCheckout] = useState<ItemCheckout[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // dữ liệu mẫu
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

  // lấy cartItems từ localstorage
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);
  //lấy sp tu id
  const getPdts = async (idProduct: string) => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/products/' + idProduct);
      // console.log(data.data);
      return data.data
    }
    catch (error) {
      console.log("ko lấy đc sp từ id");
    }
  }
  // lấy variant tu id
  const getVariant = async (idVariant: string) => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/variants/' + idVariant);
      console.log(data.variants[0]);
      return data.variants[0]
    }
    catch (error) {
      console.log("ko lấy đc bien the từ id");
    }
  }

  // tao item cho listCheckout
  const fetchProducts = async () => {
    const updatedListCheckout: ItemCheckout[] = [];
    for (const cartItem of cartItems) {
      const productData = await getPdts(cartItem.idProduct);
      const variantData = await getVariant(cartItem.idVariant);
      console.log('var' + variantData.image[0]);


      if (productData && variantData) {
        const newItemCheckout: ItemCheckout = {
          nameProduct: productData.name,
          imgVariant: variantData.image[0],
          price: productData.price,
          color: cartItem.color,
          size: cartItem.size,
          quantity: cartItem.quantity,
          totalPrice: productData.price * cartItem.quantity,
        };
        updatedListCheckout.push(newItemCheckout);
      }
    };
    setListCheckout(updatedListCheckout);
    calculateTotalPrice(updatedListCheckout)
    console.log(listCheckout);
    
  };
  useEffect(() => {
    fetchProducts();
  }, [cartItems]);
  // console.log(listCheckout);

  // tinh tong gia tien
  const calculateTotalPrice = (items: ItemCheckout[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalPrice(total);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-7xl">
        {/* Thông tin sản phẩm */}
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
          Thông tin sản phẩm
        </h2>
        <div className="border border-gray-300 p-4 mb-6 rounded-lg bg-gray-50">
          {listCheckout.map((item:ItemCheckout, index:number) => (
            <div
              key={index}
              className="flex gap-4 mb-4 border-b border-gray-300 pb-4 last:border-b-0"
            >
              <img
                src={item.imgVariant}
                alt={item.nameProduct}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.nameProduct}</p>
                <p className="text-sm text-gray-600">
                  Mã sản phẩm: {item.color}
                </p>
                {/* <p className="line-through text-gray-500">
                  {item.price} đ
                </p> */}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-lg font-semibold text-black-500">
                    {item.price} đ
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-12  p-1 rounded-md text-center">
                      x {item.quantity}
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
              Tổng giá trị sản phẩm <span>{totalPrice} đ</span>
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
