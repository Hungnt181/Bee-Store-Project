import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef } from "react";

export default function PocilySlide() {
  const ref = useRef<CarouselRef>(null);

  return (
    <div className="relative flex justify-center items-center">
      <Carousel
        ref={ref}
        className="w-full max-w-3xl text-center"
        dots={false}
        draggable
        arrows={false}
        infinite
        autoplay
        autoplaySpeed={3000}
        speed={1500}
      >
        <div className=" pointer-events-none event select-none">
          <span className="uppercase ml-4 font-medium text-gray-400">
            &lt; Chính sách đổi hàng nhanh gọn - Đổi hàng trong 3 ngày &gt;
          </span>
        </div>
        <div className=" pointer-events-none event select-none">
          <span className="uppercase ml-4 font-medium text-gray-400">
            &lt; Giao hàng tận nhà - Nhanh chóng thuận lợi &gt;
          </span>
        </div>
        <div className=" pointer-events-none event select-none">
          <span className="uppercase ml-4 font-medium text-gray-400">
            &lt; Chế độ bảo hành - Áp dụng cho Giày, Dép, Sandal &gt;
          </span>
        </div>
      </Carousel>
    </div>
  );
}
