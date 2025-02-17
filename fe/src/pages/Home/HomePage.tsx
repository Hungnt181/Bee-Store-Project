import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useGetAllProducts } from "../../hooks/queries/products/useGetAllProducts";
import SlideShowBanner from "./_components/SlideShowBanner";

export default function HomePage() {
  const { data, isPending } = useGetAllProducts();
  console.log(data);
  const navigate = useNavigate();
  const handleViewProduct = () => {
    navigate("/products");
  };
  return (
    <div className="mt-4 mb-[5%]">
      <section>
        <SlideShowBanner />
      </section>
      <section className="mt-4 flex gap-5 items-center mx-4">
        <div className="relative">
          <img
            src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_z2sBZyJ5.gif"
            alt=""
          />
          <div className="absolute bottom-3 flex justify-center w-full">
            <div>
              <h3 className="uppercase text-3xl text-[#ffffff] font-thin">
                áo đông chính hãng
              </h3>
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleViewProduct}
                  className=" bg-[#000000] text-white px-4 py-4 text-sm  hover:opacity-60 duration-300 cursor-pointer"
                >
                  XEM CHI TIẾT
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_GwCVjsyk.gif"
            alt=""
          />
          <div className="absolute bottom-3 flex justify-center w-full">
            <div>
              <span className="uppercase text-3xl  text-[#ffffff] font-thin [text-shadow:2px_2px_4px_rgba(0,0,0,0.9)]">
                GIÀY THỂ THAO
              </span>
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleViewProduct}
                  className=" bg-[#000000] text-white px-4 py-4 text-sm  hover:opacity-60 duration-300 cursor-pointer"
                >
                  XEM CHI TIẾT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-12 max-w-[1240px] mx-6 xl:mx-auto">
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-3xl uppercase font-thin">Sản phẩm mới</h3>
          <p className="text-sm font-thin">Những xu hướng thời trang mới</p>
        </div>
        {!isPending && data ? (
          <>
            <div className=" mt-8 grid grid-cols-4 gap-8">
              {data.products.map(
                (item, index) =>
                  index < 4 && <ProductCard key={index} product={item} />
              )}
            </div>
            <div className="flex justify-center mt-14">
              <button
                onClick={handleViewProduct}
                className="border border-black px-4 py-2 hover:opacity-60 duration-300 cursor-pointer rounded-md"
              >
                Xem thêm
              </button>
            </div>
          </>
        ) : (
          <div className="min-h-[20vh] items-center flex justify-center text-xl font-medium">
            Không có sản phẩm nào
          </div>
        )}
      </section>
      <hr className=" max-w-[1240px] mx-6 xl:mx-auto my-8" />
      <section className="mt-12 max-w-[1240px] mx-6 xl:mx-auto">
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-3xl uppercase font-thin">Sản bán chạy</h3>
          <p className="text-sm font-thin">
            Những sản phẩm bán chạy nhất hiện tại
          </p>
        </div>
        {!isPending && data ? (
          <>
            <div className=" mt-8 grid grid-cols-4 gap-8">
              {data.products.map(
                (item, index) =>
                  index < 4 && <ProductCard key={index} product={item} />
              )}
            </div>
            <div className="flex justify-center mt-14">
              <button
                onClick={handleViewProduct}
                className="border border-black px-4 py-2 hover:opacity-60 duration-300 cursor-pointer rounded-md"
              >
                Xem thêm
              </button>
            </div>
          </>
        ) : (
          <div className="min-h-[20vh] items-center flex justify-center text-xl font-medium">
            Không có sản phẩm nào
          </div>
        )}
      </section>
    </div>
  );
}
