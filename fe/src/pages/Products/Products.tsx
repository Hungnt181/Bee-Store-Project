import { Link } from "react-router-dom";
import FilterSide from "./_components/FilterSide";
import { ConfigProvider, Pagination, Select, Spin } from "antd";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useGetProductsWithConditions } from "../../hooks/queries/products";
import { useState } from "react";
import { IParamsProductCondition } from "../../interface/Product";

export default function FilterProducts() {
  const [params, setParams] = useState<IParamsProductCondition>({
    sortBy: "new"
  });
  const { data: filteredProducts, isPending: loadingProducts } = useGetProductsWithConditions(params);
  const handleChangeSort = (value: string) => {
    setParams({
      ...params,
      sortBy: value
    })
  }

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
          <span className="text-sm ml-2 font-light">({filteredProducts?.total || 0} Sản phẩm)</span>
        </h3>
        <div className="mt-6 grid grid-cols-[25%_75%] gap-5">
          <FilterSide params={params} setParams={setParams} />
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
                  style={{ width: 130 }}
                  options={[
                    { value: "new", label: "Mới nhất" },
                    { value: "lowToHight", label: "Giá: Tăng dần" },
                    { value: "hightToLow", label: "Giá: Giảm dần" },
                    { value: "best", label: "Bán chạy" },
                  ]}
                  onChange={handleChangeSort}
                />
              </ConfigProvider>
            </div>
            {/* PRODUCTS LIST */}
            {filteredProducts && (
              <>
                {!loadingProducts ? (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {filteredProducts?.content.products.map((item, index) => (
                      <ProductCard key={index} product={item} />
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[70vh] flex justify-center items-center">
                    <Spin />
                  </div>
                )}
                {/* PAGINATION */}
                {!loadingProducts && (
                  // <div className="flex justify-center mt-2">
                  <Pagination defaultCurrent={1} pageSize={9} total={filteredProducts?.total || 1} align="end" />
                  // </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
