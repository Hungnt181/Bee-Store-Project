import {
    FieldTimeOutlined,
    MoneyCollectOutlined,
    TruckOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { ProductType } from "../../interface/Product";
import ActionDetail from "./_components/ActionDetail";
import SlideShowImages from "./_components/SlideShowImages";
import TabDescription from "./_components/TabDescription";
const imagesDemo = [
  "https://pos.nvncdn.com/8ca22b-20641/ps/20241203_ADbovjN911.jpeg",
  "https://pos.nvncdn.com/8ca22b-20641/ps/20241203_JbBka3RRRk.jpeg",
  "https://pos.nvncdn.com/8ca22b-20641/ps/20241203_NfNVPt645k.jpeg",
  "https://pos.nvncdn.com/8ca22b-20641/ps/20241203_6Xaq8Y6yyp.jpeg",
];
const demoProducts = {
  _id: "67ab130b156e325bdbe67941",
  name: "gối kê cổ",
  price: 2,
  about: "abc",
  description: "abcd",
  status: true,
  id_cate: "67832d89dd1193100e7d073e",
  slug: "goi-ke-co",
  createdAt: "2025-02-11T09:06:19.528Z",
  updatedAt: "2025-02-11T09:06:19.528Z",
};
export default function ProductDetail() {
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
        <span>Penta Suit | Be sọc kẻ đen</span>
      </div>
      {/* PRODUCT */}
      <div className="grid grid-cols-2 mt-8 gap-8">
        <div>
          <SlideShowImages images={imagesDemo} />
          <TabDescription />
        </div>
        <div>
          <ActionDetail />
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
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCard key={index} product={demoProducts as ProductType} />
          ))}
        </div>
      </div>
      {/* NEWS PRODUCTS */}
      <div className="mt-8">
        <h3 className="text-xl font-medium">SẢN PHẨM MỚI</h3>
        <div className="grid grid-cols-4 items-center gap-2 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCard key={index} product={demoProducts as ProductType} />
          ))}
        </div>
      </div>
    </div>
  );
}
