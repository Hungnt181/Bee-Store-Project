// import { HeartOutlined, HeartFilled } from "@ant-design/icons";
// import { useState } from "react";
// import { Spin } from "antd";
// import { Link } from "react-router-dom";
// import { bestSelling } from "../../interface/Order";

// export default function ProductCardSelling({
//   product,
// }: {
//   product: bestSelling;
// }) {
//   const [isHovered, setIsHovered] = useState(false); // State to track hover status

//   return product ? (
//     <>
//       <div className="relative cursor-pointer group hover:border hover:border-black overflow-hidden">
//         <Link to={`/products/${product.productID}`}>
//           <img
//             className="w-auto h-auto min-h-[356px] object-cover transition-transform duration-300 group-hover:scale-105"
//             src={product.variantImage[0]}
//             alt=""
//           />
//         </Link>
//         <Link
//           to={`/products/${product.productID}`}
//           className="mt-3.5 text-center flex flex-col gap-2"
//         >
//           <h3 className="text-base capitalize underline hover:text-[#cccccc]">
//             {product?.productName}
//           </h3>
//           <p className="text-[#f7040f] flex gap-2 justify-center items-center">
//             {/* <span className="line-through text-black font-medium">990.000đ</span> */}
//             {Number(product?.productPrice).toLocaleString("vi-VN")}đ
//           </p>
//           <p className="text-sm font-thin uppercase">{product?.slug}</p>
//         </Link>
//         {/* discount absolute */}
//         <div className="absolute flex gap-2 items-center top-2 right-0 ">
//           <div
//             className="opacity-0 group-hover:opacity-100 duration-300"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             {/* Toggle icon on hover */}
//             {isHovered ? (
//               <HeartFilled className="text-xl " />
//             ) : (
//               <HeartOutlined className="text-xl " />
//             )}
//           </div>
//           {/* <div className="w-[60px] text-white text-center py-1.5 bg-[#f7040f]">
//             -15%
//           </div> */}
//         </div>
//       </div>
//     </>
//   ) : (
//     <div className="min-h-[286px] flex justify-center items-center min-w-[286px]">
//       <Spin />
//     </div>
//   );
// }

import { Spin } from "antd";
import { Link } from "react-router-dom";
import { bestSelling } from "../../interface/Order";

export default function ProductCardSelling({
  product,
}: {
  product: bestSelling;
}) {
  const formatPrice = (price: string | number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  if (!product) {
    return (
      <div className="w-full h-[450px] bg-gray-50 rounded-lg flex justify-center items-center shadow-sm">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] bg-zinc-100/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col border border-transparent hover:border-yellow-50/30">
      {/* Phần hình ảnh sản phẩm */}
      <div className="relative overflow-hidden w-full h-[290px] bg-gray-100 flex items-center justify-center">
        <Link to={`/products/${product.productID}`} className="w-full h-full">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            src={product.variantImage[0]}
            alt={product?.productName}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/300x320?text=Hình+ảnh+không+tồn+tại";
            }}
          />
        </Link>
      </div>

      {/* Phần thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.productID}`} className="flex-grow">
          <h3 className="text-base font-medium capitalize line-clamp-2 hover:text-red-600 transition-colors mb-2">
            {product?.productName}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Giá sản phẩm */}
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-semibold text-lg">
              {formatPrice(product?.productPrice)}
            </span>
          </div>

          {/* Slug hoặc thông tin thêm */}
          {product?.slug && (
            <p className="text-xs text-gray-500 uppercase mt-1">
              {product.slug}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
