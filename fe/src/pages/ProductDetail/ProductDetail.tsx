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

  return (
    <div className="mt-5 max-w-[1240px] mx-6 xl:mx-auto">
      {/* BREADCRUMB */}
      <div className="flex gap-2 items-center text-sm">
        <Link to={"/"} className="flex items-center gap-1">
          <img
            src="https://dominoshop.vn/tp/T0263/img/icons/back.png"
            className="w-6"
            alt=""
          />
          <span>Back</span>
        </Link>
        <span className="text-[#8F8F8F]"> / </span>
        <Link to={"/"} className="underline hover:text-cyan-500 duration-300">
          Trang chủ
        </Link>
        <span className="text-[#8F8F8F]"> / </span>
        <span>
          {variants[0]?.id_product.name} | {variants[0]?.id_product.slug}
        </span>
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
          <ul className="mt-4 text-sm font-light flex flex-col gap-2 uppercase">
            <li className="flex items-center gap-3">
              <TruckOutlined className="text-2xl" /> Giao hàng nhanh chóng -
              Thanh toán COD
            </li>
            <li className="flex items-center gap-3 uppercase">
              <MoneyCollectOutlined className="text-2xl" /> Chính sách bảo hành
              uy tín, tin cậy
            </li>
            <li className="flex items-center gap-3 uppercase">
              <FieldTimeOutlined className="text-2xl" /> Đổi trả hàng trong vòng
              3 ngày tính từ ngày nhận hàng
            </li>
          </ul>
        </div>
      </div>
      {/* PRODUCTS RELATED */}
      <div className="mt-8">
        <h3 className="text-xl font-medium">CÓ THỂ BẠN QUAN TÂM</h3>
        <div className="grid grid-cols-4 items-center gap-2 mt-4">
          {dataPro_Cate
            .filter((item: ProductType) => item.status === true)
            .map(
              (item: ProductType, index: number) =>
                index < 4 && <ProductCard product={item as ProductType} />
            )}
        </div>
      </div>
      {/* NEWS PRODUCTS */}
      <div className="mt-8">
        <h3 className="text-xl font-medium">SẢN PHẨM MỚI</h3>
        <div className="grid grid-cols-4 items-center gap-2 mt-4">
          {dataNewPro?.products
            .filter((item: ProductType) => item.status === true)
            .map(
              (item: ProductType, index: number) =>
                index < 4 && <ProductCard product={item as ProductType} />
            )}
        </div>
      </div>
    </div>
  );
}
