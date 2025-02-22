import { Link } from "react-router-dom";
import FilterSide from "./_components/FilterSide";
import { ConfigProvider, Pagination, Select, Spin } from "antd";
import { useGetAllProducts } from "../../hooks/queries/products/useGetAllProducts";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function FilterProducts() {
  const { data, isPending } = useGetAllProducts();
  return (
    <div className="mt-5 max-w-[1240px] mx-6 xl:mx-auto">
      {/* BREADCRUMB */}
      <div className="flex gap-2 items-center text-sm">
        <Link to={"/"} className="flex items-center gap-1">
          <img
            src="https://dominoshop.vn/tp/T0263/img/icons/back.png"
            className="w-6"
            alt=""
          />
          <span>Back</span>
        </Link>
        <span className="text-[#8F8F8F]"> / </span>
        <Link to={"/"} className="underline hover:text-cyan-500 duration-300">
          Trang chủ
        </Link>
        <span className="text-[#8F8F8F]"> / </span>
        <span>Sản phẩm</span>
      </div>
      <div className="mt-6">
        <h3 className="text-2xl">
          SẢN PHẨM{" "}
          <span className="text-sm ml-2 font-light">(979 Sản phẩm)</span>
        </h3>
        <div className="mt-6 grid grid-cols-[25%_75%] gap-5">
          <FilterSide />
          {/* FILTER SORT PRODUCTS */}
          <div>
            <div className="flex justify-end items-center gap-2">
              <span className="text-sm font-light">Sắp xếp theo</span>
              <ConfigProvider
                theme={{
                  components: {
                    Select: {
                      hoverBorderColor: "none",
                      activeBorderColor: "none",
                      activeOutlineColor: "none",
                    },
                  },
                  token: {
                    borderRadius: 2,
                  },
                }}
              >
                <Select
                  defaultValue="new"
                  style={{ width: 120 }}
                  options={[
                    { value: "new", label: "Mới nhất" },
                    { value: "highPrice", label: "Giá: Tăng dần dần" },
                    { value: "lowPrice", label: "Giá: Giảm dần" },
                    { value: "best", label: "Bán chạy" },
                  ]}
                />
              </ConfigProvider>
            </div>
            {/* PRODUCTS LIST */}
            {data && (
              <>
                {!isPending ? (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {data.products.map((item, index) => (
                      <ProductCard key={index} product={item} />
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[70vh] flex justify-center items-center">
                    <Spin />
                  </div>
                )}
                {/* PAGINATION */}
                {!isPending && (
                  <div className="flex justify-center mt-2">
                    <Pagination defaultCurrent={1} total={data.totalDocs} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
