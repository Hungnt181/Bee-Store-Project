<<<<<<< HEAD
import { Button, Card } from "antd";
import axios from "axios";
=======
>>>>>>> test/mergeUI
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, HomeIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

  const isSuccess = vnp_ResponseCode === "00";

  useEffect(() => {
    if (isSuccess) {
      if (vnp_ResponseCode === "00") {
        (async () => {
          const createdOrderId = localStorage.getItem("createdOrderId");
          //cập nhật cột isPaid thành true
          if (createdOrderId) {
            await axios.patch(`http://localhost:3000/api/orders/${createdOrderId}`, { isPaid: true });
            localStorage.removeItem("createdOrderId");
          }
          else {
            localStorage.removeItem("createdOrderId");
            console.log("Ko co id don hang vua tao");
          }
        })();
      }
      alert("Thanh toán thành công!");
    } else {
      localStorage.removeItem("createdOrderId");
      alert("Thanh toán thất bại!");
    }
  }, [isSuccess]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${isSuccess
          ? "bg-gradient-to-br from-blue-100 to-blue-300"
          : "bg-gradient-to-br from-blue-100 to-blue-300"
        }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 0.6,
        }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div
            className={`p-6 text-center relative ${isSuccess ? "bg-green-50" : "bg-red-50"
              }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="inline-block mb-4"
            >
              {isSuccess ? (
                <CheckCircleIcon
                  className="mx-auto text-green-500"
                  size={80}
                  strokeWidth={1.5}
                />
              ) : (
                <XCircleIcon
                  className="mx-auto text-red-500"
                  size={80}
                  strokeWidth={1.5}
                />
              )}
            </motion.div>

            <h2
              className={`text-3xl font-bold mb-2 ${isSuccess ? "text-green-600" : "text-red-600"
                }`}
            >
              {isSuccess ? "Đặt hàng thành công!" : "Thanh toán thất bại!"}
            </h2>

            <p className="text-gray-600 text-lg">
              Cảm ơn quý khách đã tin tưởng và mua sắm tại{" "}
              <span className="font-semibold text-blue-600">Bee-Store</span>
            </p>
          </div>

          <div className="p-6">
            <p className="text-gray-700 text-center mb-6">
              Chúc quý khách có trải nghiệm mua sắm tuyệt vời và hẹn gặp lại!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center justify-center
                ${isSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
                }
                text-white py-3 rounded-full
                transition-colors duration-300 space-x-2`}
              onClick={() => (window.location.href = "/")}
            >
              <HomeIcon size={20} />
              <span>Quay lại Trang Chủ</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
