import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutAdmin from "./admin/layout";
import AdminProductList from "./admin/Product/page";
import AdminCategory from "./admin/CategoryManagement/components/AdminCategory";
import AdminVariantList from "./admin/Variant/page";
import ProductEditPage from "./admin/Product/Edit/page";
import VariantEditPage from "./admin/Variant/Edit/page";
import AdminSizeList from "./admin/Size/page";
import AdminSizeAdd from "./admin/Size/Add/page";
import AdminSizeEdit from "./admin/Size/Edit/page";
import AdminSizeDetail from "./admin/Size/Detail/page";
import VoucherPage from "./admin/Voucher/page";
import VoucherAddPage from "./admin/Voucher/Add/page";
import AdminDashboarPage from "./admin/dashboard/page";
import AdminAccountPage from "./admin/Account/Admin/page";
import AdminAccountEditPage from "./admin/Account/Admin/Edit/page";
import UserAccountPage from "./admin/Account/User/page";
import AdminColorList from "./admin/Color/page";
import AdminColorAdd from "./admin/Color/Add/page";
import AdminColorEdit from "./admin/Color/Edit/page";
import AdminColorDetail from "./admin/Color/Detail/page";
import VoucherEditPage from "./admin/Voucher/Edit/page";
import ClientLayout from "./layouts/client/Layout";
import HomePage from "./pages/Home/HomePage";
import FilterProducts from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import AdminOrderPage from "./admin/Order/page";
import AdminOrderDetail from "./admin/Order/Detail/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    errorElement: <Navigate to={"/"} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/products", element: <FilterProducts /> },
      { path: "/products/:id", element: <ProductDetail /> },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: "/admin/dashboard", element: <AdminDashboarPage /> },
      { path: "/admin/product", element: <AdminProductList /> },
      { path: "/admin/size", element: <AdminSizeList /> },
      { path: "/admin/size/add", element: <AdminSizeAdd /> },
      { path: "/admin/size/edit/:id", element: <AdminSizeEdit /> },
      { path: "/admin/size/detail/:id", element: <AdminSizeDetail /> },
      { path: "/admin/color", element: <AdminColorList /> },
      { path: "/admin/color/add", element: <AdminColorAdd /> },
      { path: "/admin/color/edit/:id", element: <AdminColorEdit /> },
      { path: "/admin/color/detail/:id", element: <AdminColorDetail /> },
      { path: "/admin/product/:id/edit", element: <ProductEditPage /> },
      { path: "/admin/:id/variant", element: <AdminVariantList /> },
      { path: "/admin/variant/:id/edit", element: <VariantEditPage /> },
      { path: "/admin/category", element: <AdminCategory /> },
      { path: "/admin/voucher", element: <VoucherPage /> },
      { path: "/admin/voucher/add", element: <VoucherAddPage /> },
      { path: "/admin/voucher/:id/edit", element: <VoucherEditPage /> },
      { path: "/admin/admin_account", element: <AdminAccountPage /> },
      { path: "/admin/user_account", element: <UserAccountPage /> },
      { path: "/admin/admin_account/:id", element: <AdminAccountEditPage /> },
      { path: "/admin/order", element: <AdminOrderPage /> },
      { path: "/admin/order/:id", element: <AdminOrderDetail /> },
    ],
  },
]);
