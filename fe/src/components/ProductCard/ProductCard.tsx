// import { HeartOutlined, HeartFilled } from "@ant-design/icons";
// import { useState } from "react";
// import { ProductType } from "../../interface/Product";
// import { useGetVariantByProduct } from "../../hooks/queries/variants/useGetVariantByProduct";
// import { Spin } from "antd";
// import { Link } from "react-router-dom";

// export default function ProductCard({ product }: { product: ProductType }) {
//   const [isHovered, setIsHovered] = useState(false); // State to track hover status
//   const { data: variants, isPending } = useGetVariantByProduct(product._id);
//   return variants && !isPending ? (
//     <>
//       <div className="relative cursor-pointer group hover:border hover:border-black overflow-hidden">
//         <Link to={`/products/${product._id}`}>
//           <img
//             className="w-auto h-auto min-h-[356px] object-cover transition-transform duration-300 group-hover:scale-105"
//             src={variants?.variants[0]?.image[0]}
//             alt=""
//           />
//         </Link>
//         <Link
//           to={`/products/${product._id}`}
//           className="mt-3.5 text-center flex flex-col gap-2"
//         >
//           <h3 className="text-base capitalize underline hover:text-[#cccccc]">
//             {product?.name}
//           </h3>
//           <p className="text-[#f7040f] flex gap-2 justify-center items-center">
//             {/* <span className="line-through text-black font-medium">990.000đ</span> */}
//             {product?.price}
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
import { ProductType } from "../../interface/Product";
import { useGetVariantByProduct } from "../../hooks/queries/variants/useGetVariantByProduct";
import { Spin } from "antd";
import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: ProductType }) {
  const { data: variants, isPending } = useGetVariantByProduct(product._id);

  const formatPrice = (price: string | number) => {
    // Format giá tiền với dấu chấm ngăn cách hàng nghìn
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  // Xử lý trường hợp không có dữ liệu variants
  if (isPending) {
    return (
      <div className="w-full h-[450px] bg-gray-50 rounded-lg flex justify-center items-center shadow-sm">
        <Spin size="large" />
      </div>
    );
  }

  // Xử lý trường hợp không có dữ liệu variants
  if (!variants || !variants.variants || variants.variants.length === 0) {
    return (
      <div className="w-full h-[450px] bg-gray-50 rounded-lg flex justify-center items-center shadow-sm">
        <p className="text-gray-400">Không có dữ liệu sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
      {/* Phần hình ảnh sản phẩm */}
      <div className="relative overflow-hidden w-full h-[290px] bg-gray-100 flex items-center justify-center">
        <Link to={`/products/${product._id}`} className="w-full h-full">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            src={variants.variants[0]?.image[0]}
            alt={product?.name}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/300x320?text=Hình+ảnh+không+tồn+tại";
            }}
          />
        </Link>
      </div>

      {/* Phần thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product._id}`} className="flex-grow">
          <h3 className="text-base font-medium capitalize line-clamp-2 hover:text-red-600 transition-colors mb-2">
            {product?.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Giá sản phẩm */}
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-semibold text-lg">
              {formatPrice(product?.price)}
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
