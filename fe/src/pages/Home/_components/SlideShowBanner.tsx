import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef } from "react";

export default function SlideShowBanner() {
  const ref = useRef<CarouselRef>(null);
  const handlePrevBanner = ()=>{
    ref.current?.prev()
  }
  const handleNextBanner = ()=>{
    ref.current?.next()
  }
  return (
    <div className="relative">
      <Carousel  infinite={true} ref={ref} autoplay={true} autoplaySpeed={3000} speed={1000}>
        <div>
          <img
            src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_mdsPcOeq.gif"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_syJWHygY.gif"
            alt=""
          />
        </div>
      </Carousel>
      <div onClick={handlePrevBanner} className="absolute top-[50%] left-3 text-white bg-black opacity-65 py-3 px-3 hover:opacity-85 cursor-pointer">
        <LeftOutlined />
      </div>
      <div onClick={handleNextBanner} className="absolute top-[50%] right-3 text-white bg-black opacity-65 py-3 px-3 hover:opacity-85 cursor-pointer">
        <RightOutlined />
      </div>
    </div>
  );
}
