import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutAdmin from "./admin/layout";
import AdminProductList from "./admin/Product/page";
import HomePage from "./website/components/Home";
import AdminCategory from "./admin/category/page";
import AdminVariantList from "./admin/Variant/page";
import ProductEditPage from "./admin/Product/Edit/page";
import VariantEditPage from "./admin/Variant/Edit/page";
import AdminSizeList from "./admin/Size/page";
import AdminSizeAdd from "./admin/Size/Add/page";
import AdminSizeEdit from "./admin/Size/Edit/page";
import AdminSizeDetail from "./admin/Size/Detail/page";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: "/admin/dashboard", element: <AdminProductList /> },
      { path: "/admin/product", element: <AdminProductList /> },
      { path: "/admin/size", element: <AdminSizeList /> },
      { path: "/admin/size/add", element: <AdminSizeAdd /> },
      { path: "/admin/size/edit/:id", element: <AdminSizeEdit /> },
      { path: "/admin/size/detail/:id", element: <AdminSizeDetail /> },
      { path: "/admin/product/:id/edit", element: <ProductEditPage /> },
      { path: "/admin/:id/variant", element: <AdminVariantList /> },
      { path: "/admin/variant/:id/edit", element: <VariantEditPage /> },
      { path: "/admin/category", element: <AdminCategory /> },
    ],
  },
]);
