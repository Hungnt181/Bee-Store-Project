import {
  MoneyCollectFilled,
  TruckFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef } from "react";

export default function PocilySlide() {
  const ref = useRef<CarouselRef>(null);

  return (
    // <div className="relative">
    //   <Carousel
    //     ref={ref}
    //     className="w-[800px]"
    //     dots={false}
    //     draggable={true}
    //     arrows={false}
    //     infinite={true}
    //     autoplay={false}
    //     autoplaySpeed={3000}
    //     speed={1500}
    //   >
    //     <div className=" pointer-events-none event select-none">
    //       <p className="text-center flex items-center justify-center">
    //         <TruckFilled className="text-xl" />
    //         <span className="uppercase ml-4 font-medium">
    //           Chính sách đổi hàng nhanh gọn
    //         </span>
    //         . Đổi hàng trong vòng 3 ngày
    //       </p>
    //     </div>
    //     <div className="px-14 pointer-events-none event select-none">
    //       <p className="text-center flex items-center justify-center">
    //         <MoneyCollectFilled className="text-xl" />
    //         <span className="uppercase ml-4 font-medium">
    //           Giao hàng tận nhà
    //         </span>
    //         . Đơn giản nhanh chóng thuận lợi
    //       </p>
    //     </div>
    //     <div className="px-14 pointer-events-none event select-none">
    //       <p className="text-center flex items-center justify-center">
    //         <UserOutlined className="text-xl" />
    //         <span className="uppercase ml-4 font-medium">
    //           Chế độ bảo hành tin cậy
    //         </span>
    //         . Áp dụng bảo hành nhiều danh mục sản phẩm như Sandal, Giày, Dép
    //       </p>
    //     </div>
    //   </Carousel>
    //   {/* CONTROL */}
    //   <div onClick={prevSlide} className="absolute top-0 cursor-pointer">
    //     <LeftOutlined />
    //   </div>
    //   <div
    //     onClick={nextSlide}
    //     className="absolute right-0 top-0 cursor-pointer"
    //   >
    //     <RightOutlined />
    //   </div>
    // </div>
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
          <TruckFilled className="text-xl text-blue-400" />
          <span className="uppercase ml-4 font-medium text-gray-400">
            &lt; Chính sách đổi hàng nhanh gọn - Đổi hàng trong 3 ngày &gt;
          </span>
        </div>
        <div className=" pointer-events-none event select-none">
          <MoneyCollectFilled className="text-xl text-blue-400" />
          <span className="uppercase ml-4 font-medium text-gray-400">
            &lt; Giao hàng tận nhà - Nhanh chóng thuận lợi &gt;
          </span>
        </div>
        <div className=" pointer-events-none event select-none">
          <UserOutlined className="text-xl text-blue-400" />
          <span className="uppercase ml-4 font-medium text-gray-400">
            &lt; Chế độ bảo hành - Áp dụng cho Giày, Dép, Sandal &gt;
          </span>
        </div>
      </Carousel>
    </div>
  );
}
