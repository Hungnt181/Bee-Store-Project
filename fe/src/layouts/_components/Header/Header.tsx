import {
  BankFilled,
  PhoneFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, message } from "antd";
import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import ListitemCateegory from "./_components/ListItemCategory";
import PocilySlide from "./_components/PocilySlide";
import logoImage from "../../../assets/logo.png";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [userStatus, setUserStatus] = useState(true);
  const location = useLocation();

  const [numberInCart, setNumberInCart] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // lấy cartItems từ localstorage
  const updateCartCount = async () => {
    const idUser = localStorage.getItem("idUser");
    if (!idUser) {
      return setNumberInCart(0);
    }
    const storedCartItems = await axios.get(
      `http://localhost:3000/api/cart/${idUser}`
    );
    // console.log(storedCartItems.data.data.items);

    if (storedCartItems) {
      const cartCount = storedCartItems.data.data.items.length;
      setNumberInCart(cartCount);
      console.log("Cập nhật số lượng:", cartCount);
    } else {
      setNumberInCart(0);
      console.log("Giỏ hàng trống");
    }
  };
  //rerender so luong
  useEffect(() => {
    updateCartCount();
    // return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

  const idUser = localStorage.getItem("idUser");
  // Thêm query để lấy thông tin user
  const { data: userData } = useQuery({
    queryKey: ["USER_INFO", idUser],
    queryFn: async () => {
      if (!idUser) return null;
      const { data } = await axios.get(
        `http://localhost:3000/api/user_account/${idUser}`
      );
      return data.data;
    },
    enabled: !!idUser,
  });

  const handleLogout = () => {
    localStorage.clear();
    setNameUser("");
    navigate("/signin");
  };

  useEffect(() => {
    // Cập nhật tên và trạng thái từ API response
    if (userData) {
      setNameUser(userData.name || "");
      setUserStatus(userData.status !== false); // Chuyển đổi status thành boolean
      console.log(userData.status);
      // Kiểm tra nếu status là false, thực hiện logout
      if (userData.status === false) {
        message.error("Tài khoản đã bị vô hiệu hoá");
        handleLogout();
      }
    } else {
      setNameUser("");
      setUserStatus(true);
    }
  }, [userData, location]);

  useEffect(() => {
    if (idUser && !userStatus) {
      handleLogout();
    }
  }, [userStatus]);

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };
  return (
    <header>
      {/* LINE 1 IN HEADER */}
      <div className="max-w-[1240px] mx-6 xl:mx-auto flex items-center justify-between mt-6">
        {/* BOX 1 IN HEADER */}
        <Link to={"/"} className="flex-1">
          <img className="w-58" src={logoImage} alt="" />
        </Link>
        {/* BOX 2 IN HEADER */}
        <div className="flex items-center justify-between flex-1/2 text-sm">
          {/* SEARCH BOX */}
          <div className=" py-1.5 w-[10%] justify-between px-4 rounded-full flex items-center">
            {/* <input
              className="outline-none w-[70%] placeholder-black text-sm"
              type="text"
              placeholder="Bạn cần tìm gì?"
            />
            <SearchOutlined className="cursor-pointer" /> */}
          </div>
          {/* PHONE BOX */}
          <div className="flex items-center gap-1">
            <div className="bg-[#cccccccc] rounded-full py-1 px-2">
              <PhoneFilled />
            </div>
            <span className="font-thin">0388889999</span>
          </div>
          {/* STORE BOX */}
          <div className="flex items-center gap-1">
            <div className="bg-[#cccccccc] rounded-full py-1 px-2">
              <BankFilled className="text-lg" />
            </div>
            <span className="font-thin">13 Trịnh Văn Bô</span>
          </div>
          {/* LOGIN BOX */}
          {!nameUser ? (
            <Link
              to={"/signin"}
              className="flex items-center gap-1 hover:text-[#cccccc] duration-300"
            >
              <div className="bg-[#cccccccc] rounded-full py-1 px-2">
                <UserOutlined />
              </div>
              <span className="font-thin">Đăng nhập</span>
            </Link>
          ) : (
            <Link
              to={"/account"}
              className="flex items-center gap-1 hover:text-[#cccccc] duration-300"
            >
              <div className="bg-[#cccccccc] rounded-full py-1 px-2">
                <UserOutlined />
              </div>
              <span className="font-thin">Xin chào, {nameUser}</span>
            </Link>
          )}
          {/* WISHLIST AND CART BOX */}
          <div className="flex items-center">
            <Link to={"/cart"} className="ml-8">
              <Badge
                showZero
                offset={[10, -2]}
                color={"#8e8e8e"}
                count={numberInCart}
              >
                <ShoppingCartOutlined className="text-2xl" />
              </Badge>
            </Link>
          </div>
        </div>
      </div>
      {/* LINE 2 IN HEADER */}
      <div
        className={` w-full transition-all duration-300 ${
          isSticky ? "block" : "hidden"
        }`}
      >
        <div className="max-w-[1240px] mx-6 xl:mx-auto flex items-center">
          <ListitemCateegory isSticky={isSticky} />
        </div>
      </div>
      <div
        className={` w-full transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 bg-black shadow-lg z-50" : "mt-4"
        }`}
      >
        <div className="max-w-[1240px] mx-6 xl:mx-auto flex items-center">
          {isSticky && (
            <div
              className="hidden xl:block"
              onClick={() => handleNavigation("/")}
            >
              <h3 className="text-yellow-400 text-2xl font-bold">
                BEE <span className="text-white">STORE</span>
              </h3>
            </div>
          )}
          <ListitemCateegory isSticky={isSticky} />
        </div>
      </div>
      {/* LINE 3 IN HEADER */}
      <div className="flex justify-center mt-4">
        {location.pathname === "/" && <PocilySlide />}
      </div>
    </header>
  );
}
