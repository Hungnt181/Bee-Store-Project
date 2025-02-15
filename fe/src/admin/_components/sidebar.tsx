import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
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
  getItem("Products", "2", <DesktopOutlined />, undefined, "product"),
  getItem("Categories", "3", <DesktopOutlined />, undefined, "category"),
  getItem("Account", "4", <UserOutlined />, [
    getItem("Tài khoản admin", "sub1", undefined, undefined, "admin_account"),
    getItem("Tài khoản khách", "sub2", undefined, undefined, "user_account"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "7"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const item = items.find((item) => item?.key === e.key) || null;
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
