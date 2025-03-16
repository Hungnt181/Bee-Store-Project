/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FileOutlined,
  FormatPainterOutlined,
  GiftFilled,
  PieChartOutlined,
  ProductOutlined,
  PrinterOutlined,
  SkinOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAvatar from "./hacker.png"
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
  getItem("Danh mục", "3", <UnorderedListOutlined />, undefined, "category"),
  getItem("Kích cỡ", "4", <ProductOutlined />, undefined, "size"),
  getItem("Màu sắc", "5", <FormatPainterOutlined />, undefined, "color"),
  getItem("Mã giảm giá", "6", <GiftFilled />, undefined, "voucher"),
  getItem("Tài khoản", "7", <UserOutlined />, [
    getItem("Tài khoản admin", "sub1", undefined, undefined, "admin_account"),
    getItem("Tài khoản khách", "sub2", undefined, undefined, "user_account"),
  ]),
  getItem("Quản lý đơn hàng", "10", <PrinterOutlined />, undefined, "order"),
  getItem("Team", "8", <TeamOutlined />, [
    getItem("Team 1", "sub3"),
    getItem("Team 2", "sub4"),
  ]),
  getItem("Files", "9", <FileOutlined />),
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
      setEmailUser(userData.email)
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
              <img className="w-16 h-16 rounded-full object-cover cursor-pointer" src={userAvatar} alt="" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <LogoutOutlined
                  className="text-xl text-white cursor-pointer"
                  onClick={handleLogout}
                />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col items-center overflow-hidden w-full">
                <span className="font-medium text-sm truncate w-full text-center">{nameUser || "Loading"}</span>
                <span className="text-xs text-white/70 truncate w-full text-center">{emailUser || "Loading"}</span>
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
