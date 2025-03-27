/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GiftFilled,
  PieChartOutlined,
  SkinOutlined,
  UserOutlined,
  BgColorsOutlined,
  LogoutOutlined,
  CommentOutlined,
  PictureOutlined,
  ExpandOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAvatar from "./hacker.png";
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  url?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    url,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Thống kê", "1", <PieChartOutlined />, undefined, "dashboard"),
  getItem("Sản phẩm", "2", <SkinOutlined />, undefined, "product"),
  getItem("Danh mục", "3", <AppstoreOutlined />, undefined, "category"),
  getItem("Kích cỡ", "4", <ExpandOutlined />, undefined, "size"),
  getItem("Voucher", "5", <GiftFilled />, undefined, "voucher"),
  getItem("Tài khoản", "6", <UserOutlined />, [
    getItem("Admin", "sub1", undefined, undefined, "admin_account"),
    getItem("Khách hàng", "sub2", undefined, undefined, "user_account"),
  ]),
  getItem("Màu sắc", "7", <BgColorsOutlined />, undefined, "color"),
  getItem("Bình luận", "8", <CommentOutlined />, undefined, "comment"),

  getItem("Banner", "10", <PictureOutlined />, undefined, "banner"),
  getItem("Đơn hàng", "11", <ShoppingCartOutlined />, undefined, "order"),
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [nameUser, setNameUser] = useState("");
  const [emailUser, setEmailUser] = useState("");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      handleLogout();
      return;
    }
    const item: any = items.find((item) => item?.key === e.key) || null;
    if (item && item.url) {
      navigate(item.url); // Chuyển hướng đến URL
    } else if (e.key === "sub1") {
      navigate("admin_account"); // Chuyển hướng đến Tài khoản admin
    } else if (e.key === "sub2") {
      navigate("user_account"); // Chuyển hướng đến Tài khoản khách
    }
  };
  const idUser = localStorage.getItem("idUser");
  // Thêm query để lấy thông tin user
  const { data: userData } = useQuery({
    queryKey: ["USER_INFO", idUser],
    queryFn: async () => {
      if (!idUser) return null;
      const { data } = await axios.get(
        `http://localhost:3000/api/admin_account/${idUser}`
      );
      return data.data;
    },
    enabled: !!idUser,
  });

  useEffect(() => {
    // Cập nhật tên từ API response
    if (userData?.name) {
      setNameUser(userData.name);
      setEmailUser(userData.email);
    } else {
      setNameUser("");
      setEmailUser("");
    }
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem("nameUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("idUser");
    navigate("/signin");
  };
  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical mt-3" />
        {nameUser && (
          <div className="relative flex flex-col items-center gap-2 border-b border-white/10 mb-[2vh] px-2 pb-3 text-white">
            <div className="flex items-center justify-center w-full group relative">
              <img
                className="w-16 h-16 rounded-full object-cover cursor-pointer"
                src={userAvatar}
                alt=""
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <LogoutOutlined
                  className="text-xl text-white cursor-pointer"
                  onClick={handleLogout}
                />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col items-center overflow-hidden w-full">
                <span className="font-medium text-sm truncate w-full text-center">
                  {nameUser || "Loading"}
                </span>
                <span className="text-xs text-white/70 truncate w-full text-center">
                  {emailUser || "Loading"}
                </span>
              </div>
            )}
          </div>
        )}
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
    </>
  );
};

export default Sidebar;
