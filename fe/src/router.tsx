import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutAdmin from "./admin/layout";
import AdminProductList from "./admin/Product/page";
import HomePage from "./website/components/Home";
import AdminCategory from "./admin/CategoryManagement/components/AdminCategory";
import AdminVariantList from "./admin/Variant/page";
import ProductEditPage from "./admin/Product/Edit/page";
import VariantEditPage from "./admin/Variant/Edit/page";
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

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },

  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: "/admin/dashboard", element: <AdminDashboarPage /> },
      { path: "/admin/product", element: <AdminProductList /> },
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
    ],
  },
]);
