import {
    BankFilled,
    HeartFilled,
    PhoneFilled,
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import ListitemCateegory from "./_components/ListItemCategory";
import PocilySlide from "./_components/PocilySlide";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      {/* LINE 1 IN HEADER */}
      <div className="max-w-[1240px] mx-6 xl:mx-auto flex items-center justify-between mt-6">
        {/* BOX 1 IN HEADER */}
        <Link to={'/'} className="flex-1">
          {/* <h3 className="font-bold font-sans text-2xl text-yellow-700">
            BEE<span className="text-black"> - STORE</span>
          </h3> */}
          <img
            className="w-58"
            src='./public/logo.png'
            alt=""
          />
        </Link>
        {/* BOX 2 IN HEADER */}
        <div className="flex items-center justify-between flex-1/2 text-sm">
          {/* SEARCH BOX */}
          <div className="border-[1px] border-[#cccccccc] py-1.5 w-[25%] justify-between px-4 rounded-full flex items-center">
            <input
              className="outline-none w-[70%] placeholder-black text-sm"
              type="text"
              placeholder="Bạn cần tìm gì?"
            />
            <SearchOutlined className="cursor-pointer" />
          </div>
          {/* PHONE BOX */}
          <div className="flex items-center gap-1">
            <div className="bg-[#cccccccc] rounded-full py-1 px-2">
              <PhoneFilled />
            </div>
            <span className="font-thin">0366469999</span>
          </div>
          {/* STORE BOX */}
          <div className="flex items-center gap-1">
            <div className="bg-[#cccccccc] rounded-full py-1 px-2">
              <BankFilled className="text-lg" />
            </div>
            <span className="font-thin">180 Hàng Bông</span>
          </div>
          {/* LOGIN BOX */}
          <Link
            to={"/login"}
            className="flex items-center gap-1 hover:text-[#cccccc] duration-300"
          >
            <div className="bg-[#cccccccc] rounded-full py-1 px-2">
              <UserOutlined />
            </div>
            <span className="font-thin">Đăng nhập</span>
          </Link>
          {/* WISHLIST AND CART BOX */}
          <div className="flex items-center">
            <Link to={"/wishlist"}>
              <Badge showZero offset={[10, -2]} color={"#8e8e8e"} count={0}>
                <HeartFilled className="text-2xl" />
              </Badge>
            </Link>
            <Link to={"/cart"} className="ml-8">
              <Badge showZero offset={[10, -2]} color={"#8e8e8e"} count={0}>
                <ShoppingCartOutlined className="text-2xl" />
              </Badge>
            </Link>
          </div>
        </div>
      </div>
      {/* LINE 2 IN HEADER */}
      <div
        className={` w-full transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 bg-black shadow-lg z-50" : "mt-4"
        }`}
      >
        <div className="max-w-[1240px] mx-6 xl:mx-auto flex items-center">
          {isSticky && (
            <Link to={'/'} className="hidden xl:block">
              <h3 className="text-yellow-400 text-2xl font-bold">
                BEE <span className="text-white">STORE</span>
              </h3>
            </Link>
          )}
          <ListitemCateegory isSticky={isSticky} />
        </div>
      </div>
      {/* LINE 3 IN HEADER */}
      <div className="flex justify-center mt-4">
        <PocilySlide />
      </div>
    </header>
  );
}
