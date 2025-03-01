/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FileOutlined,
  FormatPainterOutlined,
  GiftFilled,
  PieChartOutlined,
  ProductOutlined,
  SkinOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  getItem("Team", "8", <TeamOutlined />, [
    getItem("Team 1", "sub3"),
    getItem("Team 2", "sub4"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const item: any = items.find((item) => item?.key === e.key) || null;
    if (item && item.url) {
      navigate(item.url); // Chuyển hướng đến URL
    } else if (e.key === "sub1") {
      navigate("admin_account"); // Chuyển hướng đến Tài khoản admin
    } else if (e.key === "sub2") {
      navigate("user_account"); // Chuyển hướng đến Tài khoản khách
    }
  };
  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
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
