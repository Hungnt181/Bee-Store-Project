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
            className={`relative p-1 border transition-all duration-300 rounded-lg cursor-pointer
        ${
          indexImages === index
            ? "border-blue-300 shadow-md scale-105"
            : "border-gray-300 hover:border-gray-400 hover:shadow-sm hover:scale-100"
        }
      `}
          >
            <img
              className="w-23 h-23 object-cover rounded-md"
              src={item}
              alt=""
            />
          </div>
        ))}
      </div>

      <div className="relative w-[520px] h-[490px] overflow-hidden pointer-events-none select-none rounded-lg shadow-lg bg-white">
        <Carousel
          ref={ref}
          draggable={true}
          dots={false}
          afterChange={(current: number) => setIndexImages(current)}
        >
          {images.map((item, index) => (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center"
            >
              <Image
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                src={item}
                alt={`Product image ${index}`}
                fallback="https://via.placeholder.com/520x490?text=Image+Not+Available"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
