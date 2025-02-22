import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutAdmin from "./admin/layout";
import AdminProductList from "./admin/Product/page";
import HomePage from "./website/components/Home";
import AdminCategory from "./admin/category/page";
import AdminVariantList from "./admin/Variant/page";
import ProductEditPage from "./admin/Product/Edit/page";
import VariantEditPage from "./admin/Variant/Edit/page";
import AdminAccountPage from "./admin/Account/Admin/page";
import AdminAccountEditPage from "./admin/Account/Admin/Edit/page";
import UserAccountPage from "./admin/Account/User/page";
import Signup from "./website/components/Signup/page";
import Signin from "./website/components/Signin/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/signin",
    element: <Signin />
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: "/admin/dashboard", element: <AdminProductList /> },
      { path: "/admin/product", element: <AdminProductList /> },
      { path: "/admin/product/:id/edit", element: <ProductEditPage /> },
      { path: "/admin/:id/variant", element: <AdminVariantList /> },
      { path: "/admin/variant/:id/edit", element: <VariantEditPage /> },
      { path: "/admin/category", element: <AdminCategory /> },
      { path: "/admin/admin_account", element: <AdminAccountPage /> },
      { path: "/admin/user_account", element: <UserAccountPage /> },
      { path: "/admin/admin_account/:id", element: <AdminAccountEditPage /> },
    ],
  },
]);
