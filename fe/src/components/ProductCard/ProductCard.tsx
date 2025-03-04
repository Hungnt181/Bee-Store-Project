import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import { ProductType } from "../../interface/Product";
import { useGetVariantByProduct } from "../../hooks/queries/variants/useGetVariantByProduct";
import { Spin } from "antd";
import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: ProductType }) {
  const [isHovered, setIsHovered] = useState(false); // State to track hover status
  const { data: variants, isPending } = useGetVariantByProduct(product._id);
  return variants && !isPending ? (
    <>
      <div className="relative cursor-pointer group hover:border hover:border-black overflow-hidden">
        <Link to={`/products/${product._id}`}>
          <img
            className="w-auto h-auto min-h-[356px] object-cover transition-transform duration-300 group-hover:scale-105"
            src={
              variants?.variants[0]?.image[0] ||
              "https://pos.nvncdn.com/8ca22b-20641/ps/20241203_ADbovjN911.jpeg"
            }
            alt=""
          />
        </Link>
        <Link
          to={`/products/${product._id}`}
          className="mt-3.5 text-center flex flex-col gap-2"
        >
          <h3 className="text-base capitalize underline hover:text-[#cccccc]">
            {product.name}
          </h3>
          <p className="text-[#f7040f] flex gap-2 justify-center items-center">
            {/* <span className="line-through text-black font-medium">990.000đ</span> */}
            {product.price}
          </p>
          <p className="text-sm font-thin uppercase">{product.slug}</p>
        </Link>
        {/* discount absolute */}
        <div className="absolute flex gap-2 items-center top-2 right-0 ">
          <div
            className="opacity-0 group-hover:opacity-100 duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Toggle icon on hover */}
            {isHovered ? (
              <HeartFilled className="text-xl " />
            ) : (
              <HeartOutlined className="text-xl " />
            )}
          </div>
          <div className="w-[60px] text-white text-center py-1.5 bg-[#f7040f]">
            -15%
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="min-h-[286px] flex justify-center items-center min-w-[286px]">
      <Spin />
    </div>
  );
}
