import { motion } from "framer-motion";
import { CheckCircleIcon, HomeIcon } from "lucide-react";

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
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
          <div className="bg-green-50 p-6 text-center relative">
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
              <CheckCircleIcon
                className="mx-auto text-green-500"
                size={80}
                strokeWidth={1.5}
              />
            </motion.div>

            <h2 className="text-3xl font-bold text-green-600 mb-2">
              Đặt hàng thành công!
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
              className="w-full flex items-center justify-center 
                         bg-blue-500 text-white 
                         py-3 rounded-full 
                         hover:bg-blue-600 
                         transition-colors 
                         duration-300 
                         space-x-2"
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

export default PaymentSuccessPage;
