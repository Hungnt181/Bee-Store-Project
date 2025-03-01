import { CheckOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Collapse,
  CollapseProps,
  ConfigProvider,
  Skeleton,
  Slider,
  SliderSingleProps,
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
  params: IParamsProductCondition
  setParams: (params: IParamsProductCondition) => void
}

export default function FilterSide({ params, setParams }: FilterProps) {
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 5000000]);
  const [, setCateChange] = useState<string[]>([]);
  const [sizeChange, setSizeChange] = useState<string[]>([]);
  const [colorChange, setColorChange] = useState<string[]>([]);
  const { data: listSize, isLoading: loadingSize } = useGetAllSizes();
  const { data: listColor, isLoading: loadingColor } = useGetAllColors();
  const { data: listCate, isLoading: loadingCate } = useGetAllCategories();

  const handleSizeChange = (id: string) => {
    setSizeChange(prevSizeChange => {
      const newSizeChange = prevSizeChange.includes(id)
        ? prevSizeChange.filter(item => item !== id)
        : [...prevSizeChange, id];
      setParams({ ...params, size: newSizeChange })
      return newSizeChange;
    });
  };
  const handleColorChange = (id: string) => {
    setColorChange(prevColorChange => {
      const newColorChange = prevColorChange.includes(id)
        ? prevColorChange.filter(item => item !== id)
        : [...prevColorChange, id];
      setParams({ ...params, color: newColorChange })
      return newColorChange;
    });
  };
  const handleCateChange = (id: string) => {
    setCateChange(prevCateChange => {
      const newCateChange = prevCateChange.includes(id)
        ? prevCateChange.filter(item => item !== id)
        : [...prevCateChange, id];
      setParams({ ...params, cate: newCateChange })
      return newCateChange;
    });
  };
  const handlePriceChange = (priceArr: number[]) => {
    const priceMin = priceArr[0];
    const priceMax = priceArr[1];
    setParams({ ...params, priceMin: priceMin, priceMax: priceMax })
  }
  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => value ? formatCurrency(value, "VND", "") : value;
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <span className="font-normal">DANH MỤC SẢN PHẨM</span>,
      children: (
        <ul className="flex flex-col gap-2 text-lg">
          {listCate?.data?.map((item: Category, index: number) => (
            <li key={index}>
              <Checkbox value={item?._id} onClick={() => handleCateChange(item._id ?? "")}>{item.name}</Checkbox>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "2",
      label: <span className="font-normal">KÍCH CỠ</span>,
      children: (
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {listSize?.data?.map((item: Size, index: number) => (
            <li key={index}>
              <button
                onClick={() => handleSizeChange(item._id.toString())}
                className={`w-full border  cursor-pointer border-b-2 py-2 ${sizeChange.includes(item._id.toString())
                  ? "border-black "
                  : "border-[#cecece]"
                  }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "3",
      label: <span className="font-normal">MÀU SẮC</span>,
      children: (
        <ul className="flex flex-wrap gap-5 text-sm">
          {listColor?.data.map((item: Color, index: number) => (
            <li key={index}>
              <button
                onClick={() => handleColorChange(item._id)}
                style={{
                  backgroundColor: item.hexcode,
                }}
                className={`w-10 relative h-10 cursor-pointer border border-[#cecece] text-[#cecece]`}
              >
                {colorChange.includes(item._id) && (
                  <CheckOutlined className="text-xl " />
                )}
              </button>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "4",
      label: <span className="font-normal">GIÁ</span>,
      children: (
        <div>
          <div className="flex gap-2 justify-center  text-sm text-[]">
            <span>{formatCurrency(priceFilter[0], "VND", "VNĐ")}</span> -{" "}
            <span>{formatCurrency(priceFilter[1], "VND", "VNĐ")}</span>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorPrimaryBorderHover: "black",
              },
              components: {
                Slider: {
                  trackBg: "black",
                  trackHoverBg: "black",
                  handleColor: "black",
                  handleActiveColor: "black",
                  dotActiveBorderColor: "black",
                  handleActiveOutlineColor: "black",
                },
              },
            }}
          >
            <Slider
              min={0}
              max={5000000}
              value={priceFilter}
              tooltip={{ formatter }}
              onChange={setPriceFilter}
              onChangeComplete={handlePriceChange}
              range={{ draggableTrack: true }}
            />
          </ConfigProvider>
        </div>
      ),
    },
  ];

  if (loadingCate && loadingSize && loadingColor) {
    return <Skeleton active>Loading</Skeleton>
  }
  return (
    <div>
      <div className="border px-4 py-3 border-t border-l border-r border-b-0 border-[#cecece]">
        <h3 className="uppercase font-normal">Bộ lọc</h3>
      </div>
      <ConfigProvider
        theme={{
          token: {
            borderRadiusLG: 0,
          },
        }}
      >
        <Collapse
          defaultActiveKey={["1", "2", "3", "4"]}
          expandIconPosition={"end"}
          items={items}
        />
      </ConfigProvider>
    </div>
  );
}
