import {
  FieldTimeOutlined,
  MoneyCollectOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { ProductType } from "../../interface/Product";
import ActionDetail from "./_components/ActionDetail";
import SlideShowImages from "./_components/SlideShowImages";
import TabDescription from "./_components/TabDescription";
import { useEffect, useState } from "react";
import { Variant } from "../../interface/Variant";
// import service
import { useGetVariantByProduct } from "../../hooks/queries/variants/useGetVariantByProduct";
import Size from "../../interface/Size";
import Color from "../../interface/Color";
import { useGetAllProducts } from "../../hooks/queries/products/useGetAllProducts";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";

export default function ProductDetail() {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const navigate = useNavigate();
  const { data: dataNewPro } = useGetAllProducts();
  const { id } = useParams();

  // Xử lý xét status của product
  const { data: dataPro, isSuccess } = useQuery({
    queryKey: ["PRODUCT", id],
    queryFn: async () =>
      await axios.get(`http://localhost:3000/api/products/${id}`),
  });

  const product = dataPro?.data?.data;

  useEffect(() => {
    if (isSuccess && product?.status === false) {
      message.error("Sản phẩm hiện tại không tồn tại");
      navigate("/");
    }
  }, [isSuccess, product]);

  // Call api lấy toàn bộ thông tin biến thể của sản phẩm theo id_product
  const [variants, setVariants] = useState<Variant[]>([]);
  const { data: dataVariant } = useGetVariantByProduct(id as string);

  // console.log("dataVariant", dataVariant);

  // Lấy toàn bộ màu sắc của sản phẩm
  const getAvailableColors = (variants: Variant[]) => {
    return [
      ...new Map(
        variants?.map((v: Variant) => [v.id_color.name, v.id_color])
      ).values(),
    ];
  };
  // Lấy toàn bộ kích cỡ của sản phẩm
  const getAvailableSizes = (variants: Variant[]): Size[] => {
    return [
      ...new Map(variants.map((v) => [v.id_size.name, v.id_size])).values(),
    ];
  };
  // data
  const [dataPro_Cate, setDataPro_cate] = useState<ProductType[]>([]);

  async function fetchData(id: string) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/category/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Trả về dữ liệu đã lấy được
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      return null; // Trả về null nếu có lỗi
    }
  }

  useEffect(() => {
    if (Array.isArray(variants) && variants.length > 0) {
      setColors(getAvailableColors(variants));
      setSizes(getAvailableSizes(variants));
      const fetchDataAsync = async () => {
        const data = await fetchData(variants[0]?.id_product?.id_cate?._id);
        if (data) {
          setDataPro_cate(data.products); // Cập nhật state với dữ liệu đã lấy được
        }
      };

      fetchDataAsync(); // Gọi hàm bất đồng bộ để lấy dữ liệu
    }
  }, [variants]);

  // console.log("dataPro_Cate", dataPro_Cate);

  useEffect(() => {
    if (dataVariant) {
      const data = dataVariant.variants;
      setVariants(data);
    }
  }, [dataVariant]);

  // tạo state image biến thể
  const [selectedImage, setSelectedImage] = useState<string[]>([]);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedImage(variants[0].image);
    }
  }, [variants]);

  const handleImageChange = (newImages: string[] | null) => {
    setSelectedImage(newImages ?? []);
  };
  const handleViewProduct = (id?: string) => {
    if (id) {
      navigate(`/products/${id}`);
    } else {
      navigate("/products");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-5 max-w-[1240px] mx-6 xl:mx-auto">
      {/* BREADCRUMB */}
      <div className="flex gap-2 items-center text-sm">
        <Link
          to={"/products"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-500 transition-all duration-300 shadow-sm group"
        >
          <img
            src="https://api.iconify.design/heroicons-outline/arrow-left.svg"
            className="w-4 opacity-80 transition-all duration-300 group-hover:invert group-hover:brightness-0"
            alt="Quay lại"
          />
        </Link>
        <span className="text-[#8F8F8F]"> / </span>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <Link
            to={"/"}
            className="text-gray-700 hover:text-yellow-500 no-underline transition-colors duration-300"
          >
            Trang chủ
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 hover:text-black transition-colors duration-300">
            {variants[0]?.id_product.name}
          </span>
        </div>
      </div>
      {/* PRODUCT */}
      <div className="grid grid-cols-2 mt-8 gap-8">
        <div>
          <SlideShowImages images={selectedImage} />
          <TabDescription variants={variants} colors={colors} sizes={sizes} />
        </div>
        <div>
          <ActionDetail
            variants={variants}
            colors={colors}
            sizes={sizes}
            newImage={handleImageChange}
          />
          {/* POLICY */}
          <ul className="mt-4 text-sm font-medium flex flex-col gap-2 uppercase ml-3">
            <li className="flex items-center gap-2 p-1 transition-all duration-300">
              <TruckOutlined className="text-xl text-blue-500" />
              <span className="text-gray-500">
                Giao hàng nhanh - Thanh toán COD
              </span>
            </li>
            <li className="flex items-center gap-2 p-1 transition-all duration-300">
              <MoneyCollectOutlined className="text-xl text-green-500" />
              <span className="text-gray-500">
                Chính sách bảo hành uy tín, tin cậy
              </span>
            </li>
            <li className="flex items-center gap-2 p-1 transition-all duration-300">
              <FieldTimeOutlined className="text-xl text-red-500" />
              <span className="text-gray-500">
                Đổi hàng trong vòng 3 ngày tính từ ngày nhận hàng
              </span>
            </li>
          </ul>
        </div>
      </div>
      {/* PRODUCTS RELATED */}
      <div className="mt-8">
        <h3 className="text-xl font-medium">CÓ THỂ BẠN QUAN TÂM</h3>
        <div className="grid grid-cols-4 items-center gap-2 mt-4 mb-10">
          {dataPro_Cate
            .filter((item: ProductType) => item.status === true)
            .map((item: ProductType, index: number) =>
              index < 4 ? (
                <div key={item._id} onClick={() => handleViewProduct(item._id)}>
                  <ProductCard product={item as ProductType} />
                </div>
              ) : null
            )}
        </div>
      </div>
      {/* Divider with enhanced design */}
      <div className="max-w-screen-lg mx-auto flex items-center my-20 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
        <div className="px-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
      </div>
      {/* NEWS PRODUCTS */}
      <div className="mt-8">
        <h3 className="text-xl font-medium">SẢN PHẨM MỚI</h3>
        <div className="grid grid-cols-4 items-center gap-2 mt-4 mb-8">
          {dataNewPro?.products
            .filter((item: ProductType) => item.status === true)
            .map((item: ProductType, index: number) =>
              index < 4 ? (
                <div key={item._id} onClick={() => handleViewProduct(item._id)}>
                  <ProductCard product={item as ProductType} />
                </div>
              ) : null
            )}
        </div>

        <div className="flex justify-center mt-14 mb-8">
          <button
            onClick={() => handleViewProduct()}
            className="px-10 py-3 border border-gray-300 hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wider text-sm font-medium relative overflow-hidden group rounded-full"
          >
            <span className="relative z-10 ">Xem thêm</span>
            <span className="absolute inset-0 bg-black w-0 group-hover:w-full transition-all duration-300 -z-0"></span>
          </button>
        </div>
      </div>
      {/* Divider with enhanced design */}
      <div className="max-w-screen-lg mx-auto flex items-center my-20 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
        <div className="px-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
      </div>
    </div>
  );
}
