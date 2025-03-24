/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { User, Phone, Mail, MapPin, Pencil, Tag, Lock } from "lucide-react";
import axios from "axios";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

interface CartItemDetail {
  idProduct: string;
  idVariant: string;
  color: string;
  size: string;
  quantity: number;
}

interface ItemOrder {
  name: string;
  quantity: number;
  id_variant: string;
}
interface ItemCheckout {
  idProduct: string;
  nameProduct: string;
  imgVariant: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  totalPrice: number;
}
interface VoucherItem {
  _id: string;
  title: string;
  codeName: string;
  value: number;
  quantity: number;
}

const PaymentPage = () => {
  const nav = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState<string>(
    "67bfce96db17315614fced6f"
  ); // Mặc định chọn "cod"

  // Lấy thông tin tài khoản nếu có
  const id = localStorage.getItem("idUser");

  // Fetch user data từ API
  const { data: userDataApi } = useQuery({
    queryKey: ["USER_INFO", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/user_account/${id}`
      );
      return data.data;
    },
    enabled: !!id, // Chỉ chạy khi có ID
  });
  const [cartItems, setCartItems] = useState<CartItemDetail[]>([]);
  const [itemOrder, setItemOrder] = useState<ItemOrder[]>([]);
  const [listCheckout, setListCheckout] = useState<ItemCheckout[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  //tiền thanh toán
  const [paymentPrice, setPaymentPrice] = useState<number>(0);

  // voucher
  const [voucherList, setVoucherList] = useState<VoucherItem[]>([]);
  const [promotionValue, setPromotionValue] = useState<number>(0);
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);
  const [idSelectedVoucher, setIdSelectedVoucher] = useState<string | null>(
    null
  );

  //checkbox trước khi tha toan
  const [isChecked, setIsChecked] = useState(false);
  //disable neu chua checbox
  const handleCheckboxChecked = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsChecked(event.target.checked);
  };

  // lấy cartItems từ localstorage
  useEffect(() => {
    // const storedCartItems = localStorage.getItem("cartItems");
    const storedCartItems = localStorage.getItem("selectedItemArray");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
    //lay list voucher
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/vouchers");
        setVoucherList(data.data);
      } catch (error) {
        console.log("ko lấy đc danh sách voucher" + error);
      }
    })();
  }, []);
  // console.log(voucherList);
  //lấy sp tu id
  const getPdts = async (idProduct: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/" + idProduct
      );
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log("ko lấy đc sp từ id" + error);
    }
  };
  // lấy variant tu id
  const getVariant = async (idVariant: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/variants/" + idVariant
      );
      // console.log(data.variants[0]);
      return data.variants[0];
    } catch (error) {
      console.log("ko lấy đc bien the từ id" + error);
    }
  };

  // tao item cho listCheckout
  const fetchProducts = async () => {
    const updatedListCheckout: ItemCheckout[] = [];
    const updatedListItemOrder: ItemOrder[] = [];
    for (const cartItem of cartItems) {
      const productData = await getPdts(cartItem.idProduct);
      const variantData = await getVariant(cartItem.idVariant);
      // console.log("var" + variantData.image[0]);

      if (productData && variantData) {
        const newItemCheckout: ItemCheckout = {
          idProduct: cartItem.idProduct,
          nameProduct: productData.name,
          imgVariant: variantData.image[0],
          price: productData.price,
          color: cartItem.color,
          size: cartItem.size,
          quantity: cartItem.quantity,
          totalPrice: productData.price * cartItem.quantity,
        };
        updatedListCheckout.push(newItemCheckout);

        const newItemOrder: ItemOrder = {
          name: productData.name,
          quantity: cartItem.quantity,
          id_variant: cartItem.idVariant,
        };
        updatedListItemOrder.push(newItemOrder);
      }
    }
    setItemOrder(updatedListItemOrder);
    setListCheckout(updatedListCheckout);
    calculateTotalPrice(updatedListCheckout);
    // console.log(listCheckout);
  };
  useEffect(() => {
    fetchProducts();
  }, [cartItems]);
  // console.log(listCheckout);

  // tinh tong gia tien
  const calculateTotalPrice = (items: ItemCheckout[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalPrice(total);
    setPaymentPrice(total);
  };

  //lấy gia tri voucher từ select

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    const selectedId = String(
      e.target.options[e.target.selectedIndex].getAttribute("data-id")
    );
    setSelectedVoucher(selectedValue);
    setIdSelectedVoucher(selectedId);
  };
  // const fetchVoucher (idSelectedVoucher)

  // lấy voucher tu id
  const getVoucher = async (idVoucher: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/vouchers/" + idVoucher
      );
      return data.data;
    } catch (error) {
      console.log("ko lấy đc bien the từ id" + error);
    }
  };

  //onclick event
  const getPromotionValue = async () => {
    if (selectedVoucher !== null && idSelectedVoucher) {
      const voucher = await getVoucher(idSelectedVoucher);
      let discount = totalPrice/100 * voucher.value;
      (discount > voucher.maxValue) ? (discount = voucher.maxValue): (discount)
      setPromotionValue(discount);
      setPaymentPrice(totalPrice - discount);
    }
  };

  // form state
  const [customerName, setCustomerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userInForm, setUserInForm] = useState<string | null>(null);

  // Nếu có tài khoản thì tự render vào
  useEffect(() => {
    if (userDataApi) {
      setCustomerName(userDataApi.name);
      setPhoneNumber(userDataApi.tel);
      setEmail(userDataApi.email);
      setAddress(userDataApi.address);
      setUserInForm(userDataApi._id);
    }
  }, [userDataApi]);

  //handleSubmitOrder
  const handleSubmitOrder = async () => {
    setLoading(true);
    let receiverId = "";
    let itemOrderIds: string[] = [];
    try {
      // Api tạo thông tin người nhận
      try {
        const receiverInfo = await fetch(
          `http://localhost:3000/api/receivers`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: customerName,
              phone: phoneNumber,
              address: address,
            }),
          }
        );
        const receiverData = await receiverInfo.json();
        if (!receiverInfo.ok) {
          // Đẩy message ra UI
          message.error(
            receiverData.message || "Tạo thông tin người nhận thất bại"
          );
          return; // dừng xử lý tiếp
        }
        receiverId = receiverData.data._id;
        // console.log("receiverId:", receiverId);
      } catch (error) {
        // Bắt lỗi fetch, parse hoặc throw error thủ công
        if (error instanceof Error) {
          message.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } else {
          message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
      }

      // Api tạo item order
      try {
        const itemOrders = await fetch(`http://localhost:3000/api/itemOrder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            itemOrder.map((item: ItemOrder) => ({
              name: item.name,
              quantity: item.quantity,
              id_variant: item.id_variant,
            }))
          ),
        });
        const itemOrderData = await itemOrders.json();
        if (!itemOrders.ok) {
          // Đẩy message ra UI
          message.error(itemOrderData.message || "Tạo item order thất bại");
          return; // dừng xử lý tiếp
        }
        itemOrderIds = itemOrderData.data.map((item: any) => item._id);
        // console.log("itemOrderId:", itemOrderIds);
      } catch (error) {
        // Bắt lỗi fetch, parse hoặc throw error thủ công
        if (error instanceof Error) {
          message.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } else {
          message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
      }

      // Api tạo order
      try {
        const newOrder = await fetch(`http://localhost:3000/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total: paymentPrice,
            shippingFee: 0,
            isPaid:
              selectedPayment === "67bfce96db17315614fced6f" ? false : true,
            voucher: idSelectedVoucher == "" ? null : idSelectedVoucher,
            user: userInForm,
            payment: selectedPayment,
            receiverInfo: receiverId,
            itemsOrder: itemOrderIds,
            status: "Chưa xác nhận",
          }),
        });

        const orderData = await newOrder.json();
        if (!orderData.ok) {
          throw new Error(orderData.message || "Tạo đơn hàng thất bại");
        }

        // message.success("Đặt hàng thành công!");
        setCartItems([]);
        localStorage.removeItem("cartItems");
        // clear list checkout
        setListCheckout([]);
        setPaymentPrice(0);
        setSelectedVoucher(null);
        setPromotionValue(0);
        nav("/notify2");
      } catch (error) {
        // Bắt lỗi fetch, parse hoặc throw error thủ công
        if (error instanceof Error) {
          message.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } else {
          message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
      }

      ///////// kết thúc
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        message.error(err.message || "Có lỗi xảy ra");
      } else {
        message.error("Có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
      //clear cart items
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-7xl">
        {/* Thông tin sản phẩm */}
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
          Thông tin sản phẩm
        </h2>
        <div className="border border-gray-300 p-4 mb-6 rounded-lg bg-gray-50">
          {listCheckout.map((item: ItemCheckout, index: number) => (
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
                <p className="font-semibold">
                  <Link to={`/products/${item.idProduct}`}>
                    <span className="text-black">{item.nameProduct}</span>
                  </Link>
                </p>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  Loại màu: <div className="border rounded w-[20px] h-[20px]" style={{ backgroundColor: item.color }}></div>
                </div>
                <p className="text-sm text-gray-600">
                  Loại cỡ: <span className="text-[16px] font-bold text-black">{item.size}</span>
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
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="relative w-full">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border border-gray-300 p-3 pl-10 rounded w-full
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="relative w-full">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Địa chỉ email (không bắt buộc)"
              className="border border-gray-300 p-3 pl-10 rounded w-full
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Nhập địa chỉ cụ thể"
              className="border border-gray-300 p-3 pl-10 rounded w-full
               focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              checked={selectedPayment === "67bfce96db17315614fced6f"}
              onChange={() => setSelectedPayment("67bfce96db17315614fced6f")}
            />
            Thanh toán khi nhận hàng
          </label>

          <label className="flex items-center gap-2 mb-6">
            <input
              type="radio"
              name="payment"
              className="w-4 h-4"
              value="bank"
              checked={selectedPayment === "67bfcec4db17315614fced70"}
              onChange={() => setSelectedPayment("67bfcec4db17315614fced70")}
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
              Giảm giá từ voucher <span>{promotionValue} đ</span>
            </p>
            <p className="flex justify-between text-lg font-semibold text-red-500  pt-2 ">
              Tổng thanh toán{" "}
              <span className="text-xl font-bold">{paymentPrice} đ</span>
            </p>
            <p className="text-right text-red-500">
              Bạn đã tiết kiệm được <span>{promotionValue} đ</span>
            </p>
          </div>
          {/* Giảm giá */}
          <div className="w-full md:w-1/3 border border-gray-300 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Mã giảm giá</h3>
            <div className="relative w-full mb-3">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <select
                onChange={handleSelectChange}
                className="w-full ps-8 pe-4 py-2 border rounded-xl"
              >
                <option value="" disabled selected hidden={true}>
                  Mời bạn chọn voucher
                </option>
                <option value={0}>Ko dùng voucher</option>
                {voucherList.map((voucher: VoucherItem) => (
                  <option
                    key={voucher._id}
                    value={voucher.value}
                    data-id={voucher._id}
                  >
                    {voucher.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={getPromotionValue}
              className="bg-black text-white px-4 py-2 w-full rounded 
                   hover:bg-yellow-500 transition duration-300"
            >
              Áp dụng
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={isChecked}
            onChange={handleCheckboxChecked}
          />{" "}
          Đồng ý với các điều khoản và quy định của website
        </label>
        <button
          className={`bg-black text-white px-6 py-3 w-full mt-4 rounded-lg text-lg font-semibold transition duration-300
        ${isChecked ? "hover:bg-yellow-500" : "cursor-not-allowed opacity-50"}`}
          disabled={!isChecked}
          onClick={handleSubmitOrder}
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
