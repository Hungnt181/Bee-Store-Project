import { useState } from "react";

const OrderSummary = () => {
  const [order, setOrder] = useState({
    id: "#ORD123456",
    date: "24/02/2025",
    customer: {
      name: "Đặng Văn Tiến",
      phone: "0388366215",
      email: "dangtien0104@gmail.com",
      address: "123 Phúc Am, Duyên Thái, Hà Nội",
    },
    total: "1,900,000 đ",
    shippingFee: "0 đ",
    discount: "0 đ",
    status: "Đang xử lý",
    paymentStatus: "Chưa thanh toán",
    notes: "Giao hàng trong giờ hành chính. Liên hệ trước khi giao.",
    items: [
      {
        name: "CHACO J105375 - ĐEN - 8",
        quantity: 1,
        price: "1,900,000 đ",
        image: "https://picsum.photos/100/100",
      },
    ],
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const reasons = [
    "Thay đổi ý định",
    "Đặt nhầm sản phẩm",
    "Tìm thấy giá tốt hơn",
    "Thay đổi địa chỉ nhận hàng",
    "Lý do khác",
  ];

  const handleCancelOrder = () => {
    setOrder((prev) => ({
      ...prev,
      status: "Đã hủy",
      paymentStatus: "Hoàn tiền (nếu có)",
    }));
    setShowCancelModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Hóa đơn đặt hàng
        </h2>
        <div className="border-b border-gray-300 pb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Mã đơn hàng:</span> {order.id}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Ngày đặt hàng:</span> {order.date}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Trạng thái đơn hàng:</span>{" "}
            <span
              className={`font-semibold ${
                order.status === "Đã hủy" ? "text-red-600" : "text-green-600"
              }`}
            >
              {order.status}
            </span>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Trạng thái thanh toán:</span>{" "}
            <span
              className={`font-semibold ${
                order.paymentStatus === "Đã thanh toán"
                  ? "text-green-600"
                  : order.status === "Đã hủy"
                  ? "text-gray-600"
                  : "text-red-600"
              }`}
            >
              {order.paymentStatus}
            </span>
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900">
          Thông tin khách hàng
        </h3>
        <div className="border-b border-gray-300 pb-4 space-y-1">
          <p className="text-gray-700">
            <span className="font-semibold">Tên khách hàng:</span>{" "}
            {order.customer.name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Số điện thoại:</span>{" "}
            {order.customer.phone}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {order.customer.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Địa chỉ:</span>{" "}
            {order.customer.address}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900">
          Chi tiết đơn hàng
        </h3>
        <div className="border-b border-gray-300 pb-4 space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg shadow-sm"
              />
              <div>
                <p className="text-gray-800 font-semibold">{item.name}</p>
                <p className="text-gray-600">Số lượng: {item.quantity}</p>
                <p className="text-gray-600">Giá: {item.price}</p>
              </div>
            </div>
          ))}
          <h3 className="text-xl font-semibold text-gray-900">Ghi chú</h3>
          <p className="text-gray-700">{order.notes}</p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900">Tổng tiền</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Tạm tính:</span>
            <span>{order.total}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Phí vận chuyển:</span>
            <span>{order.shippingFee}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Mã giảm giá:</span>
            <span className="text-red-500">-{order.discount}</span>
          </div>

          <div className="flex justify-between text-gray-900 text-2xl font-semibold border-t border-gray-300 pt-2">
            <span className="text-xl font-semibold text-gray-900">
              Thành tiền:
            </span>
            <span className="text-2xl font-bold">{order.total}</span>
          </div>
        </div>

        {order.status !== "Đã hủy" && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full bg-gray-300 text-white py-2 rounded-lg font-semibold hover:bg-gray-400"
          >
            Hủy đơn hàng
          </button>
        )}

        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <label
                htmlFor="cancel-reason"
                className="block text-black-700 pb-3 font-semibold"
              >
                Chọn lý do hủy đơn
              </label>
              <select
                id="cancel-reason"
                className="w-full p-2 border border-gray-500 rounded-lg
                focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="">-- Chọn lý do --</option>
                {reasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {cancelReason === "Lý do khác" && (
                <input
                  type="text"
                  placeholder="Nhập lý do"
                  className="w-full mt-2 p-2 border border-gray-500 rounded-lg
                  focus:border-blue-200 focus:ring-1 focus:ring-blue-300 outline-none"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
