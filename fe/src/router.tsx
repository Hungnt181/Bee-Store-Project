import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutAdmin from "./admin/layout";
import AdminProductList from "./admin/Product/page";
import HomePage from "./website/components/Home";
import AdminCategory from "./admin/category/page";
import AdminVariantList from "./admin/Variant/page";
import ProductEditPage from "./admin/Product/Edit/page";
import VariantEditPage from "./admin/Variant/Edit/page";
import AdminColorList from "./admin/Color/page";
import AdminColorAdd from "./admin/Color/Add/page";
import AdminColorEdit from "./admin/Color/Edit/page";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: "/admin/dashboard", element: <AdminProductList /> },
      { path: "/admin/product", element: <AdminProductList /> },
      { path: "/admin/color", element: <AdminColorList /> },
      { path: "/admin/color/add", element: <AdminColorAdd /> },
      { path: "/admin/color/edit/:id", element: <AdminColorEdit /> },
      { path: "/admin/product/:id/edit", element: <ProductEditPage /> },
      { path: "/admin/:id/variant", element: <AdminVariantList /> },
      { path: "/admin/variant/:id/edit", element: <VariantEditPage /> },
      { path: "/admin/category", element: <AdminCategory /> },
    ],
  },
]);
