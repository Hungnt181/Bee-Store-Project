import { Button } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div
      className="flex items-center justify-center h-screen relative"
      style={{
        backgroundImage:
          "url('https://haycafe.vn/wp-content/uploads/2022/01/Hinh-nen-mau-xam-dep-nhat.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center bg-opacity-30 backdrop-blur-xl shadow-2xl rounded-3xl p-20 max-w-3xl border border-white border-opacity-40">

        <h1 className="text-[8rem] font-extrabold flex items-center justify-center gap-4 text-gray-800 drop-shadow-lg">
          4🐝4
        </h1>

        <p className="text-2xl mt-4 font-semibold text-gray-800">
          There's NOTHING here...
        </p>
        
        <p className="text-md mt-2 font-light text-gray-600">
          ...maybe the page you're looking for is not found or never existed.
        </p>

        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center mt-10">

            <Button
              className="px-8 py-4 text-2xl font-semibold rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white 
              transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none 
              focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"

              style={{
                borderRadius: '50px', 
                fontFamily: '"Poppins", sans-serif', 
              }}>
                Back to Home →
            </Button>
            
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}