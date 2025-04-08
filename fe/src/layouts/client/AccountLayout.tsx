import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
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
    localStorage.clear();
    navigate("/signin");
  };

  if (isLoading) return <Skeleton />;

  return (
    <div className="max-w-[1240px] mx-auto px-4 mt-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 bg-white shadow-md rounded-2xl p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Xin chào,</h2>
            <p className="text-xl font-semibold text-indigo-600">{nameUser}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 mt-4 text-sm font-medium text-red-500 hover:underline"
            >
              <LogoutOutlined /> Đăng xuất
            </button>
          </div>
          <div className="mt-8 space-y-3">
            <NavLink
              to="/account"
              end
              className={({ isActive }) =>
                `block w-full px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`
              }
            >
              <UserOutlined /> Thông tin cá nhân
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                `block w-full px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`
              }
            >
              <ShoppingCartOutlined /> Lịch sử đặt hàng
            </NavLink>
            {/* <NavLink
              to="/account/address"
              className={({ isActive }) =>
                `block w-full px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`
              }
            >
              <TruckOutlined /> Thông tin giao hàng
            </NavLink> */}
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white shadow-md rounded-2xl p-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
