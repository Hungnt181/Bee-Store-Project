import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";

export default function SlideShowBanner() {
  return (
    <div className="relative">
      <Carousel autoplay={true} autoplaySpeed={3000} speed={1500}>
        <div>
          <img
            src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_mdsPcOeq.gif"
            alt=""
          />
        </div>
        <div>
          <img
            src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_mdsPcOeq.gif"
            alt=""
          />
        </div>
      </Carousel>
      <div className="absolute top-[50%] left-5 ">
        <LeftOutlined color="#fff" className="text-white"/>
      </div>
      <div className="absolute top-[50%] right-5">
        <RightOutlined className="text-white"/>
      </div>
    </div>
  );
}
