import { Button, Card } from "antd";
import { motion } from "framer-motion";

const OrderCancelled = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl text-center bg-white rounded-3xl border border-gray-300">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-green-500 mt-4">
              Hủy hàng thành công!
            </h2>
            <p className="text-gray-700 mt-4 text-lg text-center">
              Quý khách sẽ được tư vấn viên liên hệ để trao đổi về việc hoàn
              tiền vào tài khoản trong thời gian sớm nhất.
            </p>
            <p className="text-gray-700 mt-2 text-lg font-medium">
              Nếu quý khách chưa thanh toán, vui lòng bỏ qua thông báo này.
            </p>
            <p className="text-gray-700 text-lg font-medium mt-2">
              Xin cảm ơn quý khách!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6"
            >
              <Button
                type="primary"
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-lg py-3 rounded-full w-full shadow-lg transform transition duration-300 hover:scale-105"
                onClick={() => (window.location.href = "/cart")}
              >
                Quay lại Giỏ Hàng
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrderCancelled;
