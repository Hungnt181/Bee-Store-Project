// import { CheckOutlined } from "@ant-design/icons";
// import {
//   Checkbox,
//   Collapse,
//   CollapseProps,
//   ConfigProvider,
//   Skeleton,
//   Slider,
//   SliderSingleProps,
// } from "antd";
// import { useState } from "react";
// import { useGetAllSizes } from "../../../hooks/queries/sizes";
// import Size from "../../../interface/Size";
// import { useGetAllColors } from "../../../hooks/queries/colors";
// import Color from "../../../interface/Color";
// import { useGetAllCategories } from "../../../hooks/queries/categories";
// import { Category } from "../../../interface/Category";
// import { IParamsProductCondition } from "../../../interface/Product";
// import { formatCurrency } from "../../../helpers/utils";

// export type FilterProps = {
//   params: IParamsProductCondition;
//   setParams: (params: IParamsProductCondition) => void;
// };

// export default function FilterSide({ params, setParams }: FilterProps) {
//   const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000000]);
//   const [, setCateChange] = useState<string[]>([]);
//   const [sizeChange, setSizeChange] = useState<string[]>([]);
//   const [colorChange, setColorChange] = useState<string[]>([]);
//   const { data: listSize, isLoading: loadingSize } = useGetAllSizes();
//   const { data: listColor, isLoading: loadingColor } = useGetAllColors();
//   const { data: listCate, isLoading: loadingCate } = useGetAllCategories();

//   const handleSizeChange = (id: string) => {
//     setSizeChange((prevSizeChange) => {
//       const newSizeChange = prevSizeChange.includes(id)
//         ? prevSizeChange.filter((item) => item !== id)
//         : [...prevSizeChange, id];
//       setParams({ ...params, size: newSizeChange });
//       return newSizeChange;
//     });
//   };
//   const handleColorChange = (id: string) => {
//     setColorChange((prevColorChange) => {
//       const newColorChange = prevColorChange.includes(id)
//         ? prevColorChange.filter((item) => item !== id)
//         : [...prevColorChange, id];
//       setParams({ ...params, color: newColorChange });
//       return newColorChange;
//     });
//   };
//   const handleCateChange = (id: string) => {
//     setCateChange((prevCateChange) => {
//       const newCateChange = prevCateChange.includes(id)
//         ? prevCateChange.filter((item) => item !== id)
//         : [...prevCateChange, id];
//       setParams({ ...params, cate: newCateChange });
//       return newCateChange;
//     });
//   };
//   const handlePriceChange = (priceArr: number[]) => {
//     const priceMin = priceArr[0];
//     const priceMax = priceArr[1];
//     setParams({ ...params, priceMin: priceMin, priceMax: priceMax });
//   };
//   const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
//     value
//   ) => (value ? formatCurrency(value, "VND", "") : value);
//   const items: CollapseProps["items"] = [
//     {
//       key: "1",
//       label: <span className="font-normal">DANH MỤC SẢN PHẨM</span>,
//       children: (
//         <ul className="flex flex-col gap-2 text-lg">
//           {listCate?.data?.map((item: Category, index: number) => (
//             <li key={index}>
//               <Checkbox
//                 value={item?._id}
//                 onClick={() => handleCateChange(item._id ?? "")}
//               >
//                 {item.name}
//               </Checkbox>
//             </li>
//           ))}
//         </ul>
//       ),
//     },
//     {
//       key: "2",
//       label: <span className="font-normal">KÍCH CỠ</span>,
//       children: (
//         <ul className="grid grid-cols-2 gap-2 text-sm">
//           {listSize?.data?.map((item: Size, index: number) => (
//             <li key={index}>
//               <button
//                 onClick={() => handleSizeChange(item._id.toString())}
//                 className={`w-full border  cursor-pointer border-b-2 py-2 ${
//                   sizeChange.includes(item._id.toString())
//                     ? "border-black "
//                     : "border-[#cecece]"
//                 }`}
//               >
//                 {item.name}
//               </button>
//             </li>
//           ))}
//         </ul>
//       ),
//     },
//     {
//       key: "3",
//       label: <span className="font-normal">MÀU SẮC</span>,
//       children: (
//         <ul className="flex flex-wrap gap-5 text-sm">
//           {listColor?.data.map((item: Color, index: number) => (
//             <li key={index}>
//               <button
//                 onClick={() => handleColorChange(item._id)}
//                 style={{
//                   backgroundColor: item.hexcode,
//                 }}
//                 className={`w-10 relative h-10 cursor-pointer border border-[#cecece] text-[#cecece]`}
//               >
//                 {colorChange.includes(item._id) && (
//                   <CheckOutlined className="text-xl " />
//                 )}
//               </button>
//             </li>
//           ))}
//         </ul>
//       ),
//     },
//     {
//       key: "4",
//       label: <span className="font-normal">GIÁ</span>,
//       children: (
//         <div>
//           <div className="flex gap-2 justify-center  text-sm text-[]">
//             <span>{formatCurrency(priceFilter[0], "VND", "VNĐ")}</span> -{" "}
//             <span>{formatCurrency(priceFilter[1], "VND", "VNĐ")}</span>
//           </div>
//           <ConfigProvider
//             theme={{
//               token: {
//                 colorPrimaryBorderHover: "black",
//               },
//               components: {
//                 Slider: {
//                   trackBg: "black",
//                   trackHoverBg: "black",
//                   handleColor: "black",
//                   handleActiveColor: "black",
//                   dotActiveBorderColor: "black",
//                   handleActiveOutlineColor: "black",
//                 },
//               },
//             }}
//           >
//             <Slider
//               min={0}
//               max={5000000}
//               value={priceFilter}
//               tooltip={{ formatter }}
//               onChange={setPriceFilter}
//               onChangeComplete={handlePriceChange}
//               range={{ draggableTrack: true }}
//             />
//           </ConfigProvider>
//         </div>
//       ),
//     },
//   ];

//   if (loadingCate && loadingSize && loadingColor) {
//     return <Skeleton active>Loading</Skeleton>;
//   }
//   return (
//     <div>
//       <div className="border px-4 py-3 border-t border-l border-r border-b-0 border-[#cecece]">
//         <h3 className="uppercase font-normal">Bộ lọc</h3>
//       </div>
//       <ConfigProvider
//         theme={{
//           token: {
//             borderRadiusLG: 0,
//           },
//         }}
//       >
//         <Collapse
//           defaultActiveKey={["1", "2", "3", "4"]}
//           expandIconPosition={"end"}
//           items={items}
//         />
//       </ConfigProvider>
//     </div>
//   );
// }
import { CheckOutlined, FilterOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Collapse,
  CollapseProps,
  ConfigProvider,
  Skeleton,
  Slider,
  SliderSingleProps,
  Tooltip,
  Badge,
} from "antd";
import { useState } from "react";
import { useGetAllSizes } from "../../../hooks/queries/sizes";
import Size from "../../../interface/Size";
import { useGetAllColors } from "../../../hooks/queries/colors";
import Color from "../../../interface/Color";
import { useGetAllCategories } from "../../../hooks/queries/categories";
import { Category } from "../../../interface/Category";
import { IParamsProductCondition } from "../../../interface/Product";
import { formatCurrency } from "../../../helpers/utils";

export type FilterProps = {
  params: IParamsProductCondition;
  setParams: (params: IParamsProductCondition) => void;
};

export default function FilterSide({ params, setParams }: FilterProps) {
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000000]);
  const [, setCateChange] = useState<string[]>([]);
  const [sizeChange, setSizeChange] = useState<string[]>([]);
  const [colorChange, setColorChange] = useState<string[]>([]);
  const { data: listSize, isLoading: loadingSize } = useGetAllSizes();
  const { data: listColor, isLoading: loadingColor } = useGetAllColors();
  const { data: listCate, isLoading: loadingCate } = useGetAllCategories();

  const handleSizeChange = (id: string) => {
    setSizeChange((prevSizeChange) => {
      const newSizeChange = prevSizeChange.includes(id)
        ? prevSizeChange.filter((item) => item !== id)
        : [...prevSizeChange, id];
      setParams({ ...params, size: newSizeChange });
      return newSizeChange;
    });
  };

  const handleColorChange = (id: string) => {
    setColorChange((prevColorChange) => {
      const newColorChange = prevColorChange.includes(id)
        ? prevColorChange.filter((item) => item !== id)
        : [...prevColorChange, id];
      setParams({ ...params, color: newColorChange });
      return newColorChange;
    });
  };

  const handleCateChange = (id: string) => {
    setCateChange((prevCateChange) => {
      const newCateChange = prevCateChange.includes(id)
        ? prevCateChange.filter((item) => item !== id)
        : [...prevCateChange, id];
      setParams({ ...params, cate: newCateChange });
      return newCateChange;
    });
  };

  const handlePriceChange = (priceArr: number[]) => {
    const priceMin = priceArr[0];
    const priceMax = priceArr[1];
    setParams({ ...params, priceMin: priceMin, priceMax: priceMax });
  };

  const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
    value
  ) => (value ? formatCurrency(value, "VND", "") : value);

  // Đếm tổng số bộ lọc đang active
  const countActiveFilters = () => {
    return (
      (params.cate?.length || 0) +
      (params.size?.length || 0) +
      (params.color?.length || 0) +
      (params.priceMin !== 0 || params.priceMax !== 5000000 ? 1 : 0)
    );
  };

  const activeFiltersCount = countActiveFilters();

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex justify-between items-center w-full">
          <span className="font-medium text-gray-800">DANH MỤC SẢN PHẨM</span>
          {params.cate && params.cate.length > 0 && (
            <Badge count={params.cate.length} size="small" color="#111111" />
          )}
        </div>
      ),
      children: (
        <ul className="flex flex-col gap-2 py-1">
          {listCate?.data?.map((item: Category, index: number) => {
            const isChecked = params.cate?.includes(item._id ?? "");
            return (
              <li
                key={index}
                className={`transition-colors duration-200 rounded-md px-2 py-1 ${
                  isChecked ? "bg-gray-200" : "hover:bg-gray-50"
                }`}
              >
                <Checkbox
                  value={item?._id}
                  onChange={() => handleCateChange(item._id ?? "")}
                  className="w-full py-2 px-1"
                  checked={isChecked}
                >
                  <span className="text-gray-700 ml-2">{item.name}</span>
                </Checkbox>
              </li>
            );
          })}
        </ul>
      ),
    },

    {
      key: "2",
      label: (
        <div className="flex justify-between items-center w-full">
          <span className="font-medium text-gray-800">KÍCH CỠ</span>
          {params.size && params.size.length > 0 && (
            <Badge count={params.size.length} size="small" color="#111111" />
          )}
        </div>
      ),
      children: (
        <div className="py-3">
          <ul className="grid grid-cols-4 gap-2 text-sm">
            {listSize?.data?.map((item: Size, index: number) => (
              <li key={index}>
                <button
                  onClick={() => handleSizeChange(item._id.toString())}
                  className={`w-full transition-all duration-300 border px-3 py-2 rounded-md text-center font-medium
                    ${
                      sizeChange.includes(item._id.toString())
                        ? "bg-gray-500 text-white border-gray-500 shadow-md"
                        : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-black hover:bg-gray-100 hover:shadow-lg"
                    }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ),
    },

    {
      key: "3",
      label: (
        <div className="flex justify-between items-center w-full">
          <span className="font-medium text-gray-800">MÀU SẮC</span>
          {params.color && params.color.length > 0 && (
            <Badge count={params.color.length} size="small" color="#111111" />
          )}
        </div>
      ),
      children: (
        <div className="py-3">
          <ul className="grid grid-cols-5 gap-3">
            {listColor?.data.map((item: Color, index: number) => (
              <li key={index} className="flex justify-center">
                <Tooltip title={item.name}>
                  <button
                    onClick={() => handleColorChange(item._id)}
                    style={{ backgroundColor: item.hexcode }}
                    className={`w-10 h-10 transition-all duration-200 relative cursor-pointer rounded-full 
                      ${
                        colorChange.includes(item._id)
                          ? "ring-2 ring-black ring-offset-2"
                          : "ring-1 ring-gray-300 hover:ring-gray-400"
                      }`}
                  >
                    {colorChange.includes(item._id) && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full">
                        <CheckOutlined className="text-white drop-shadow-md text-xs" />
                      </div>
                    )}
                  </button>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      ),
    },

    {
      key: "4",
      label: (
        <div className="flex justify-between items-center w-full">
          <span className="font-medium text-gray-800">GIÁ</span>
          {(params.priceMin !== 0 || params.priceMax !== 5000000) && (
            <Badge count="1" size="small" color="#111111" />
          )}
        </div>
      ),
      children: (
        <div className="py-4 px-2">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium">
              {formatCurrency(priceFilter[0], "VND", "₫")}
            </span>
            <span className="text-xs text-gray-500">-</span>
            <span className="text-sm font-medium">
              {formatCurrency(priceFilter[1], "VND", "₫")}
            </span>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#000000",
                colorPrimaryBorderHover: "#000000",
              },
              components: {
                Slider: {
                  trackBg: "#000000",
                  trackHoverBg: "#000000",
                  handleColor: "#ffffff",
                  handleActiveColor: "#ffffff",
                  dotActiveBorderColor: "#000000",
                  handleActiveOutlineColor: "#000000",
                  railBg: "#e5e7eb",
                  handleSize: 16,
                  handleSizeHover: 18,
                  handleLineWidth: 2,
                  handleLineWidthHover: 2,
                },
              },
            }}
          >
            <Slider
              min={0}
              max={5000000}
              step={100000}
              value={priceFilter}
              tooltip={{ formatter }}
              onChange={setPriceFilter}
              onChangeComplete={handlePriceChange}
              range={{ draggableTrack: true }}
            />
          </ConfigProvider>

          <div className="grid grid-cols-5 gap-2 text-xs text-gray-500 mt-2">
            <div>0₫</div>
            <div>1tr₫</div>
            <div>2tr₫</div>
            <div>3tr₫</div>
            <div className="text-right">5tr₫</div>
          </div>
        </div>
      ),
    },
  ];

  if (loadingCate && loadingSize && loadingColor) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    // <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    //   <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
    //     <h3 className="uppercase font-semibold text-gray-800 flex items-center justify-between">
    //       <div className="flex items-center">
    //         <FilterOutlined className="mr-2" />
    //         BỘ LỌC SẢN PHẨM
    //       </div>
    //       {activeFiltersCount > 0 && (
    //         <Badge
    //           count={activeFiltersCount}
    //           overflowCount={99}
    //           color="#111111"
    //         />
    //       )}
    //     </h3>
    //   </div>
    //   <ConfigProvider
    //     theme={{
    //       token: {
    //         borderRadiusLG: 0,
    //         colorBorder: "#e5e7eb",
    //         colorTextHeading: "#374151",
    //         fontSize: 14,
    //         fontSizeHeading5: 14,
    //         lineHeight: 1.5,
    //         controlHeight: 36,
    //       },
    //       components: {
    //         Collapse: {
    //           headerPadding: "12px 16px",
    //           contentPadding: "4px 16px 16px",
    //           borderRadiusLG: 0,
    //           headerBg: "white",
    //         },
    //         Checkbox: {
    //           borderRadius: 2,
    //         },
    //       },
    //     }}
    //   >
    //     <Collapse
    //       defaultActiveKey={["1", "2", "3", "4"]}
    //       expandIconPosition={"end"}
    //       size="small"
    //       ghost
    //       items={items}
    //     />
    //   </ConfigProvider>

    //   {activeFiltersCount > 0 && (
    //     <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
    //       <span className="text-xs text-gray-500">
    //         {activeFiltersCount} bộ lọc đang áp dụng
    //       </span>
    //       <button
    //         className="text-xs border border-gray-300 text-gray-600 hover:text-white hover:bg-gray-600 px-3 py-1 rounded-md font-medium transition-all duration-300"
    //         onClick={() => {
    //           setParams({
    //             ...params,
    //             cate: [],
    //             size: [],
    //             color: [],
    //             priceMin: 0,
    //             priceMax: 5000000,
    //           });
    //           setSizeChange([]);
    //           setColorChange([]);
    //           setCateChange([]);
    //           setPriceFilter([0, 5000000]);
    //         }}
    //       >
    //         Xóa bộ lọc
    //       </button>
    //     </div>
    //   )}
    // </div>
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-[90%] mr-auto">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="uppercase font-semibold text-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <FilterOutlined className="mr-2" />
            BỘ LỌC SẢN PHẨM
          </div>
          {activeFiltersCount > 0 && (
            <Badge
              count={activeFiltersCount}
              overflowCount={99}
              color="#111111"
            />
          )}
        </h3>
      </div>
      <ConfigProvider
        theme={{
          token: {
            borderRadiusLG: 0,
            colorBorder: "#e5e7eb",
            colorTextHeading: "#374151",
            fontSize: 14,
            fontSizeHeading5: 14,
            lineHeight: 1.5,
            controlHeight: 36,
          },
          components: {
            Collapse: {
              headerPadding: "12px 16px",
              contentPadding: "4px 16px 16px",
              borderRadiusLG: 0,
              headerBg: "white",
            },
            Checkbox: {
              borderRadius: 2,
            },
          },
        }}
      >
        <Collapse
          defaultActiveKey={["1", "2", "3", "4"]}
          expandIconPosition="end"
          size="small"
          ghost
          items={items}
        />
      </ConfigProvider>

      {activeFiltersCount > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
          <span className="text-xs text-gray-500">
            {activeFiltersCount} bộ lọc đang áp dụng
          </span>
          <button
            className="text-xs border border-gray-300 text-gray-600 hover:text-white hover:bg-gray-600 px-3 py-1 rounded-md font-medium transition-all duration-300"
            onClick={() => {
              setParams({
                ...params,
                cate: [],
                size: [],
                color: [],
                priceMin: 0,
                priceMax: 5000000,
              });
              setSizeChange([]);
              setColorChange([]);
              setCateChange([]);
              setPriceFilter([0, 5000000]);
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
