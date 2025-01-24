import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutAdmin from "./admin/layout";
import AdminProductList from "./admin/Product/page";
import HomePage from "./website/components/Home";
import AdminCategory from "./admin/category/page";
import AdminVariantList from "./admin/Variant/page";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: "/admin/dashboard", element: <AdminProductList /> },
      { path: "/admin/product", element: <AdminProductList /> },
      { path: "/admin/:id/variant", element: <AdminVariantList /> },
      { path: "/admin/category", element: <AdminCategory /> },
    ],
  },
]);
