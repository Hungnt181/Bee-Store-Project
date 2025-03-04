import {
  ShoppingCartOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";

export default function AccountLayout() {
  return (
    <div className="max-w-[1240px] mx-6 xl:mx-auto mt-12">
      <div className="flex gap-5">
        <div className="basis-[30%]">
          <h1 className="text-3xl font-bold">Xin chào, Hiền Vương</h1>
          <button className="mt-4 uppercase text-sm font-bold underline">
            Đăng xuất
          </button>
          <div className="mt-8">
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `text-lg flex items-center gap-3 border border-gray-200 rounded-t-sm px-4 font-semibold py-4 ${
                  isActive && window.location.pathname === "/account"
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
                `text-lg flex items-center gap-3 border-x border-gray-200  px-4 font-semibold py-4 ${
                  isActive ? "bg-[#f6f6f6]" : ""
                }`
              }
            >
              <ShoppingCartOutlined /> Lịch sử đặt hàng
            </NavLink>
            <NavLink
              to={"/account/address"}
              className={({ isActive }) =>
                `text-lg flex items-center gap-3 border border-gray-200 rounded-b-sm px-4 font-semibold py-4 ${
                  isActive ? "bg-[#f6f6f6]" : ""
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
