// import { ProductType } from "../../interface/Product";
// import { useGetVariantByProduct } from "../../hooks/queries/variants/useGetVariantByProduct";
// import { Spin } from "antd";
// import { Link } from "react-router-dom";

// export default function ProductCard({ product }: { product: ProductType }) {
//   const { data: variants, isPending } = useGetVariantByProduct(product._id);

//   const formatPrice = (price: string | number) => {
//     // Format giá tiền với dấu chấm ngăn cách hàng nghìn
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
//   };

//   // Xử lý trường hợp không có dữ liệu variants
//   if (isPending) {
//     return (
//       <div className="w-full h-[450px] bg-gray-50 rounded-lg flex justify-center items-center shadow-sm">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   // Xử lý trường hợp không có dữ liệu variants
//   if (!variants || !variants.variants || variants.variants.length === 0) {
//     return (
//       <div className="w-full h-[450px] bg-gray-50 rounded-lg flex justify-center items-center shadow-sm">
//         <p className="text-gray-400">Không có dữ liệu sản phẩm</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-[450px] bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
//       {/* Phần hình ảnh sản phẩm */}
//       <div className="relative overflow-hidden w-full h-[290px] bg-gray-100 flex items-center justify-center">
//         <Link to={`/products/${product._id}`} className="w-full h-full">
//           <img
//             className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//             src={variants.variants[0]?.image[0]}
//             alt={product?.name}
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://via.placeholder.com/300x320?text=Hình+ảnh+không+tồn+tại";
//             }}
//           />
//         </Link>
//       </div>

//       {/* Phần thông tin sản phẩm */}
//       <div className="p-4 flex flex-col flex-grow">
//         <Link to={`/products/${product._id}`} className="flex-grow">
//           <h3 className="text-base font-medium capitalize line-clamp-2 hover:text-red-600 transition-colors mb-2">
//             {product?.name}
//           </h3>
//         </Link>

//         <div className="mt-auto">
//           {/* Giá sản phẩm */}
//           <div className="flex items-center gap-2">
//             <span className="text-red-600 font-semibold text-lg">
//               {formatPrice(product?.price)}
//             </span>
//           </div>

//           {/* Slug hoặc thông tin thêm */}
//           {product?.slug && (
//             <p className="text-xs text-gray-500 uppercase mt-1">
//               {product.slug}
//             </p>
//           )}
//         </div>
//       </div>
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
    <div className="w-full h-[450px] bg-zinc-100/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col border border-transparent hover:border-yellow-50/30">
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
