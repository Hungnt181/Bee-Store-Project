import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useGetAllProducts } from "../../hooks/queries/products/useGetAllProducts";
import SlideShowBanner from "./_components/SlideShowBanner";
import { ProductType } from "../../interface/Product";
import Chatbot from "./ChatBot";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { bestSelling } from "../../interface/Order";
import ProductCardSelling from "../../components/ProductCard/ProductCardSeliing";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { data, isPending } = useGetAllProducts();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation effect when component mounts
    setIsVisible(true);

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleViewProduct = (id?: string) => {
    if (id) {
      navigate(`/products/${id}`);
    } else {
      navigate("/products");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get data best selling product
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Thêm số 0 nếu tháng < 10
  const formattedDate = `${year}-${month}`;

  const { data: bestSellingProduct } = useQuery({
    queryKey: ["SellingProduct"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/statistics/best-selling-products?type2=monthly&month=${formattedDate}`
      );
      return data;
    },
  });

  console.log("best-selling product", bestSellingProduct);

  return (
    <div
      className={`mt-4 mb-16 transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Hero Banner Section with Enhanced Overlay */}
      <section className="relative">
        <SlideShowBanner />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 pointer-events-none" />
      </section>

      {/* Feature Categories with Refined Animation */}
      <section className="mt-12 px-4 md:px-8 lg:px-16 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl border border-transparent hover:border-gray-200">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-500" />
            <img
              src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_z2sBZyJ5.gif"
              alt="Áo đông chính hãng"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center transform transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={() => handleViewProduct()}
                className="bg-black/80 text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 border border-transparent hover:border-black/20 rounded-full"
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl border border-transparent hover:border-gray-200">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-500" />
            <img
              src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_GwCVjsyk.gif"
              alt="Giày thể thao"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center transform transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={() => handleViewProduct()}
                className="bg-black/80 text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 border border-transparent hover:border-black/20 rounded-full"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Products Section with Enhanced Styling */}
      <section className="mt-20 max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl uppercase font-light tracking-wide relative inline-block">
            Sản phẩm mới
            <span className="block h-1 w-24 bg-gray-700 mx-auto mt-3 transition-all duration-300 hover:w-32"></span>
          </h2>
          <p className="text-sm text-gray-600 mt-3 italic">
            Những xu hướng thời trang mới nhất
          </p>
        </div>

        {!isPending && data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {data.products
                .filter((item: ProductType) => item.status === true)
                .map(
                  (item, index) =>
                    index < 4 && (
                      <div
                        key={item._id}
                        className="group transform transition-all duration-300 hover:-translate-y-1"
                        onClick={() => handleViewProduct(item._id)}
                      >
                        <div className=" rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                          <ProductCard product={item} />
                        </div>
                      </div>
                    )
                )}
            </div>
            <div className="flex justify-center mt-14">
              <button
                onClick={() => handleViewProduct()}
                className="px-10 py-3 border border-gray-300 hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wider text-sm font-medium relative overflow-hidden group rounded-full"
              >
                <span className="relative z-10">Xem thêm</span>
                <span className="absolute inset-0 bg-black w-0 group-hover:w-full transition-all duration-300 -z-0"></span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-24 text-gray-500 italic">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 text-gray-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
              Không có sản phẩm nào
            </div>
          </div>
        )}
      </section>

      {/* Divider with enhanced design */}
      <div className="max-w-screen-lg mx-auto flex items-center my-20 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
        <div className="px-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
      </div>

      {/* Best Selling Products Section with Enhanced Styling */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl uppercase font-light tracking-wide relative inline-block">
            Sản phẩm bán chạy
            <span className="block h-1 w-24 bg-gray-700 mx-auto mt-3 transition-all duration-300 hover:w-32"></span>
          </h2>
          <p className="text-sm text-gray-600 mt-3 italic">
            Những sản phẩm được yêu thích nhất hiện nay
          </p>
        </div>

        {!isPending && data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {bestSellingProduct
                .filter((item: bestSelling) => item.status === true)
                .slice(0, 4)
                .map((item: bestSelling, index: number) => (
                  <div
                    key={index}
                    className="group transform transition-all duration-300 hover:-translate-y-1"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    <div className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <ProductCardSelling product={item} />
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-center mt-14">
              <button
                onClick={() => handleViewProduct()}
                className="px-10 py-3 border border-gray-300 hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wider text-sm font-medium relative overflow-hidden group rounded-full"
              >
                <span className="relative z-10 ">Xem thêm</span>
                <span className="absolute inset-0 bg-black w-0 group-hover:w-full transition-all duration-300 -z-0"></span>
              </button>
            </div>
            {/* Divider with enhanced design */}
            <div className="max-w-screen-lg mx-auto flex items-center my-20 px-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="px-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-24 text-gray-500 italic">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 text-gray-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
              Không có sản phẩm nào
            </div>
          </div>
        )}
      </section>
      <div>
        <Chatbot></Chatbot>
      </div>
    </div>
  );
}
