import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AlertTriangle, Clock } from "lucide-react";

const PaymentPageOl = () => {
  const [order, setOrder] = useState({
    amount: "1.900.000 VND",
    orderValue: "1.900.000 VND",
    shippingFee: "0 VND",
    orderId: "#ORD123456",
    supplier: "CÔNG TY CỔ PHẦN BEE_STORE",
    countdown: { minutes: 119, seconds: 18 },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setOrder((prevOrder) => {
        let { minutes, seconds } = prevOrder.countdown;
        if (seconds === 0) {
          if (minutes === 0) return prevOrder;
          minutes -= 1;
          seconds = 59;
        } else {
          seconds -= 1;
        }
        return { ...prevOrder, countdown: { minutes, seconds } };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="w-full max-w-3xl bg-white flex justify-between items-center p-5 shadow-md rounded-xl border border-gray-200">
        <img
          src="https://i.gyazo.com/cd4ad37ac9f9ae75473542526f69e79e.png"
          alt="VNPAY"
          className="h-12"
        />
        <div className="flex items-center text-gray-500 font-medium text-lg">
          <Clock className="mr-2 text-red-500" size={18} />
          Giao dịch hết hạn sau
          <div className="flex items-center ml-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              {order.countdown.minutes.toString().padStart(2, "0")}
            </span>
            <span className="mx-2 text-black-600 font-bold text-xl">:</span>
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              {order.countdown.seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </header>

      <div className="w-full max-w-3xl bg-white mt-8 p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin đơn hàng
          </h2>

          <hr className="mb-4 border-gray-300" />

          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Số tiền thanh toán:</span>
            <span className="text-blue-600 text-xl font-bold block">
              {order.amount}
            </span>
          </p>

          <p className="text-gray-700 mt-3 text-lg">
            <span className="font-semibold">Giá trị đơn hàng:</span>
            <span className="block">{order.orderValue}</span>
          </p>

          <p className="text-gray-700 mt-3 text-lg">
            <span className="font-semibold">Phí giao dịch:</span>
            <span className="block">{order.shippingFee}</span>
          </p>

          <p className="text-gray-700 mt-3 text-lg">
            <span className="font-semibold">Mã đơn hàng:</span>
            <span className="block break-words">{order.orderId}</span>
          </p>

          <p className="text-gray-700 mt-3 text-lg">
            <span className="font-semibold">Nhà cung cấp:</span>
            <span className="block uppercase">{order.supplier}</span>
          </p>
        </div>

        <div className="w-full lg:w-1/2 p-4 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Quét mã qua ứng dụng Ngân hàng/ Ví điện tử
          </h2>

          {/* Hướng dẫn thanh toán */}
          <button className="flex items-center text-blue-500 mt-2 hover:underline">
            <span className="text-lg mr-1">ℹ</span> Hướng dẫn thanh toán
          </button>

          <div className="flex flex-col items-center">
            {/* Logo VNPAY QR */}
            <div className="mt-2 mb-1">
              <span className="text-red-500 font-bold text-lg">VN</span>
              <span className="text-blue-500 font-bold text-lg">PAY</span>
              <span className="text-xs text-red-600">QR</span>
            </div>

            {/* QR Code với border tùy chỉnh */}
            <div className="relative inline-block p-3">
              <div className="relative bg-white p-2">
                <QRCodeSVG value="https://example.com" size={150} />
                {/* Các góc xanh giống ảnh */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
              </div>
            </div>

            {/* Scan to Pay */}
            <p className="mt-2 text-sm text-blue-500 italic">Scan to Pay</p>
          </div>
          {/* Nút hủy thanh toán */}
          <button className="mt-6 px-6 py-3 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 transition">
            Hủy thanh toán
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-yellow-100 text-yellow-900 p-5 rounded-lg mt-6 flex items-start shadow-md border border-yellow-300">
        <AlertTriangle className="mr-3 mt-1 text-yellow-600" size={26} />
        <p className="text-lg">
          Quý khách vui lòng không tắt trình duyệt cho đến khi nhận được kết quả
          giao dịch trên website. Nếu đã thanh toán nhưng chưa nhận kết quả, vui
          lòng bấm
          <a
            href="#"
            className="text-blue-500 no-underline hover:text-red-500 ml-1"
          >
            "Tại đây"
          </a>{" "}
          để nhận kết quả. Xin cảm ơn!
        </p>
      </div>
    </div>
  );
};

export default PaymentPageOl;
