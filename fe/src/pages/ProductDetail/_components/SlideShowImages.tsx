import { Carousel, Image } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef, useState } from "react";

export default function SlideShowImages({ images }: { images: string[] }) {
  const [indexImages, setIndexImages] = useState(0);
  const ref = useRef<CarouselRef>(null);
  const handleClickItemImages = (index: number) => {
    setIndexImages(index);
    ref.current?.goTo(index);
  };
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        {images.map((item, index) => (
          <div
            onClick={() => handleClickItemImages(index)}
            key={index}
            className={`p-1 border ${
              indexImages === index ? "border-black" : "border-[#c0c0c0]"
            } rounded-md cursor-pointer`}
          >
            <img className="w-24" src={item} alt="" />
          </div>
        ))}
      </div>
      <div className="relative w-[489px] min-h-[459px] pointer-events-none select-none">
        <Carousel
          ref={ref}
          draggable={true}
          dots={false}
          afterChange={(current: number) => setIndexImages(current)}
        >
          {images.map((item, index) => (
            <div key={index}>
              <Image className="object-cover" src={item} />
            </div>
          ))}
        </Carousel>
        {/* DISCOUNT */}
        {/* <div className="absolute text-sm text-white font-medium px-4 py-1 top-2 right-0 bg-red-500">
          -15%
        </div> */}
      </div>
    </div>
  );
}
