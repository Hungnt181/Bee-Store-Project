import { Button, Card } from "antd";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-xl text-center bg-white rounded-3xl border border-gray-200">
          <div className="flex flex-col items-center">
            <img
              src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_640.png"
              alt="Success"
              className="w-20 h-20 mb-4"
            />
            <h2 className="text-3xl font-bold text-green-500 mt-4">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Cảm ơn quý khách đã tin tưởng và mua sắm tại&nbsp;
              <span className="font-semibold text-blue-600">Bee-Store</span>
            </p>
            <p className="text-gray-600 text-lg">
              Chúc quý khách có trải nghiệm mua sắm tuyệt vời và hẹn gặp lại!
            </p>
            <p className="text-gray-600 mt-4 text-lg font-medium">⬇️</p>
            <p className="text-3 mt-4">
              Chú ý:{" "}
              <i>
                Quý khách được hoàn đơn trong vòng 3 ngày kể từ ngày nhận hàng
              </i>
            </p>
            <div className="flex flex-col gap-4 w-full mt-6">
              {/* <Button
                type="primary"
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-lg py-3 rounded-full w-full shadow-lg transform transition duration-300 hover:scale-105"
                onClick={() => (window.location.href = "/invoice")}
              >
                Xem hóa đơn
              </Button> */}
              <Button
                type="default"
                className="border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white text-lg py-3 rounded-full w-full shadow-lg transform transition duration-300 hover:scale-105"
                onClick={() => (window.location.href = "/")}
              >
                Quay lại Trang Chủ
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
