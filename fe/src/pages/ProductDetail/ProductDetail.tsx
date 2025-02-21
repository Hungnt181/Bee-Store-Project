import { Link } from "react-router-dom";

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
    </div>
  );
}
