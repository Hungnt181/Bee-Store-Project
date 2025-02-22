import { CheckCircleFilled } from "@ant-design/icons";
import { Button, InputNumber } from "antd";
import { useState } from "react";

export default function ActionDetail() {
  const [quantity, setQuantity] = useState<number>(1);
  const handleClickBuy = () => {
    console.log(quantity);
  };
  return (
    <div>
      {/* INFOR MATION PRODUCT */}
      <div>
        <h3 className="uppercase text-xl font-normal">
          Penta Suit | Be sọc kẻ đen
        </h3>
        <p className="font-thin text-base mt-1">
          Mã sản phẩm: <span className="uppercase">BOBEBEN743</span>
        </p>
        <p className="font-thin line-through text-base mt-1">
          Giá cũ: <span className="uppercase">990.000 VNĐ</span>
        </p>
        <p className="font-normal text-xl mt-1">
          Giá: <span className="uppercase">840.000 VNĐ</span>
        </p>
      </div>
      {/* VARIANTS PRODUCT */}
      {/* COLORS */}
      <div className="mt-4">
        <p className="font-medium">Màu</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative cursor-pointer border-2 border-[#c0c0c0]">
            <img
              src="https://pos.nvncdn.com/8ca22b-20641/ps/20241203_ADbovjN911.jpeg"
              className="w-12"
              alt=""
            />
            {/* USE THIS ICON TO CHECK ACTIVE */}
            <div className="absolute -right-2 -top-3">
              <CheckCircleFilled />
            </div>
          </div>
        </div>
      </div>
      {/* SIZE */}
      <div className="mt-4">
        <p className="font-medium">Kích thước</p>
        <div className="flex items-center gap-2 mt-2">
          {/* SIZE ACTIVE */}
          <div className="border flex justify-center items-center bg-black cursor-pointer w-10 h-10">
            <span className="uppercase text-white">S</span>
          </div>
          {/* NONE ACTIVE */}
          <div className="border flex justify-center items-center border-[#c0c0c0] cursor-pointer w-10 h-10">
            <span className="uppercase">M</span>
          </div>
          <div className="border flex justify-center items-center border-[#c0c0c0] cursor-pointer w-10 h-10">
            <span className="uppercase">XL</span>
          </div>
        </div>
      </div>
      {/* QUANTITY */}
      <div className="mt-4">
        <p>Số lượng</p>
        <div className="antd-custom mt-2 flex items-center gap-2">
          <Button
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            className="h-full"
            disabled={quantity === 1}
          >
            -
          </Button>
          <InputNumber
            min={1}
            defaultValue={1}
            value={quantity}
            className="flex items-center"
            controls={false}
          />
          <Button
            onClick={() => {
              if (quantity > 0) {
                setQuantity(quantity + 1);
              }
            }}
            className=""
          >
            +
          </Button>
          <span className="ml-2">Sẵn có 3</span>
        </div>
      </div>
      {/* BUTTON BUY */}
      <div className="mt-4">
        <button
          onClick={handleClickBuy}
          className="bg-black text-white uppercase cursor-pointer w-3/4 py-3.5 text-sm"
        >
          Đặt mua
        </button>
      </div>
    </div>
  );
}
