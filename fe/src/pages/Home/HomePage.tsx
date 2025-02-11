import ProductCard from "../../components/ProductCard/ProductCard";
import { useGetAllProducts } from "../../hooks/queries/products/useGetAllProducts";
import SlideShowBanner from "./_components/SlideShowBanner";

export default function HomePage() {
  const { data, isPending } = useGetAllProducts();
  console.log(data);
  return (
    <div className="mt-12 mb-[5%]">
      <section>
        <SlideShowBanner />
      </section>
      <section className="mt-12 max-w-[1240px] mx-6 xl:mx-auto">
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-3xl uppercase font-thin">Sản phẩm mới</h3>
          <p className="text-sm font-thin">Những xu hướng thời trang mới</p>
        </div>
        {!isPending && data && (
          <div className="flex mt-8 items-center gap-6">
            {data.products.map((item, index) => (
              <ProductCard key={index} product={item}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
