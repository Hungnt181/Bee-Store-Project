import { Link, useNavigate } from "react-router-dom";
import FilterSide from "./_components/FilterSide";
import { ConfigProvider, Select, Spin } from "antd";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useGetProductsWithConditions } from "../../hooks/queries/products";
import { useState } from "react";
import { IParamsProductCondition } from "../../interface/Product";

export default function FilterProducts() {
  const navigate = useNavigate();
  const [params, setParams] = useState<IParamsProductCondition>({
    sortBy: "new",
  });
  const { data: filteredProducts, isPending: loadingProducts } =
    useGetProductsWithConditions(params);
  const handleChangeSort = (value: string) => {
    setParams({
      ...params,
      sortBy: value,
    });
  };
  const handleViewProduct = (id?: string) => {
    navigate(`/products/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="mt-5 max-w-[1240px] mx-6 xl:mx-auto">
      {/* BREADCRUMB */}
      <div className="flex gap-2 items-center text-sm">
        <Link
          to={"/"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-500 transition-all duration-300 shadow-sm group"
        >
          <img
            src="https://api.iconify.design/heroicons-outline/arrow-left.svg"
            className="w-4 opacity-80 transition-all duration-300 group-hover:invert group-hover:brightness-0"
            alt="Quay lại"
          />
        </Link>

        <span className="text-[#8F8F8F]"> / </span>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <Link
            to={"/"}
            className="text-gray-700 hover:text-yellow-500 no-underline transition-colors duration-300"
          >
            Trang chủ
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 hover:text-black transition-colors duration-300">
            Sản phẩm
          </span>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center text-2xl">
          {/* Title and Product Count */}
          <div className="flex items-center">
            DANH SÁCH SẢN PHẨM{" "}
            <span className="text-sm ml-2 font-light">
              ({filteredProducts?.total || 0} Sản phẩm)
            </span>
          </div>
          {/* Sorting Section */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">
              Sắp xếp theo
            </span>
            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    controlItemBgHover: "#f3f4f6", // Hover background color
                    colorText: "#333", // Main text color
                    colorPrimaryHover: "#2563eb", // Border color on hover
                  },
                },
                token: {
                  borderRadius: 0, // Slight border radius
                  colorBorder: "#d1d5db", // Light gray border
                  colorPrimary: "#2563eb", // Active border color
                },
              }}
            >
              <Select
                defaultValue="new"
                style={{ width: 150 }}
                className="border border-gray-300 shadow-sm hover:border-gray-300 transition-all duration-300"
                options={[
                  { value: "new", label: "📅 Mới nhất" },
                  { value: "lowToHight", label: "⬆️ Giá: Tăng dần" },
                  { value: "hightToLow", label: "⬇️ Giá: Giảm dần" },
                  { value: "best", label: "🔥 Bán chạy" },
                ]}
                onChange={handleChangeSort}
              />
            </ConfigProvider>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[25%_75%]">
          <FilterSide params={params} setParams={setParams} />

          <div>
            {/* PRODUCTS LIST */}
            {filteredProducts && (
              <>
                {!loadingProducts ? (
                  <div className="grid grid-cols-3 gap-2">
                    {filteredProducts?.content.products.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleViewProduct(item._id)}
                      >
                        <ProductCard product={item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[70vh] flex justify-center items-center">
                    <Spin />
                  </div>
                )}
                {/* Divider with enhanced design */}
                <div className="max-w-screen-lg mx-auto flex items-center my-20 px-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
                  <div className="px-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
