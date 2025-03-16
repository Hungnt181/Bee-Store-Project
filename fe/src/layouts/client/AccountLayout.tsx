import {
  ShoppingCartOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AccountLayout() {

  const [nameUser, setNameUser] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const idUser = localStorage.getItem("idUser");

  // Thêm query để lấy thông tin user
  const { data: userData, isLoading } = useQuery({
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

  useEffect(() => {
    if (userData?.name) {
      setNameUser(userData.name);
    } else {
      setNameUser("");
    }
  }, [userData, location]);

  const handleLogout = () => {
    localStorage.removeItem("nameUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("idUser");
    navigate("/signin");
  };

  if (isLoading) return <Skeleton />;

  return (
    <div className="max-w-[1240px] mx-6 xl:mx-auto mt-12">
      <div className="flex gap-5">
        <div className="basis-[30%]">
          <h1 className="text-3xl font-bold">Xin chào, {nameUser}</h1>
          <button className="mt-4 uppercase text-sm font-bold underline transition hover:text-red-500 cursor-pointer"
            onClick={handleLogout}>
            Đăng xuất
          </button>
          <div className="mt-8">
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `text-lg flex items-center gap-3 border border-gray-200 rounded-t-sm px-4 font-semibold py-4 ${isActive && window.location.pathname === "/account"
                  ? "bg-[#f6f6f6]"
                  : ""
                }`
              }
            >
              <UserOutlined /> Thông tin cá nhân
            </NavLink>
            <NavLink
              to={"/account/orders"}
              className={({ isActive }) =>
                `text-lg flex items-center gap-3 border-x border-gray-200  px-4 font-semibold py-4 ${isActive ? "bg-[#f6f6f6]" : ""
                }`
              }
            >
              <ShoppingCartOutlined /> Lịch sử đặt hàng
            </NavLink>
            <NavLink
              to={"/account/address"}
              className={({ isActive }) =>
                `text-lg flex items-center gap-3 border border-gray-200 rounded-b-sm px-4 font-semibold py-4 ${isActive ? "bg-[#f6f6f6]" : ""
                }`
              }
            >
              <TruckOutlined /> Thông tin giao hàng
            </NavLink>
          </div>
        </div>
        <div className="basis-[70%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
