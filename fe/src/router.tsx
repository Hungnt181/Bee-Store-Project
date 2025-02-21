import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutAdmin from "./admin/layout";
import AdminProductList from "./admin/Product/page";
import AdminCategory from "./admin/category/page";
import AdminVariantList from "./admin/Variant/page";
import ProductEditPage from "./admin/Product/Edit/page";
import VariantEditPage from "./admin/Variant/Edit/page";
import ClientLayout from "./layouts/client/Layout";
import HomePage from "./pages/Home/HomePage";
import FilterProducts from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";

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
      { path: "/admin/dashboard", element: <AdminProductList /> },
      { path: "/admin/product", element: <AdminProductList /> },
      { path: "/admin/product/:id/edit", element: <ProductEditPage /> },
      { path: "/admin/:id/variant", element: <AdminVariantList /> },
      { path: "/admin/variant/:id/edit", element: <VariantEditPage /> },
      { path: "/admin/category", element: <AdminCategory /> },
    ],
  },
]);
