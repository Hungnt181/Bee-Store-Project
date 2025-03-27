import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Category } from "../../../../interface/Category";

export default function ListitemCategory({ isSticky }: { isSticky: boolean }) {
  const navigate = useNavigate();
  const { data: dataCate } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/categories`);
      return data.data;
    },
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <ul className="uppercase flex gap-8 flex-1 justify-center text-base font-medium items-center">
      <li
        onClick={() => handleNavigation("/products")}
        className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
          isSticky
            ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
            : "hover:bg-gray-700 hover:text-white hover:scale-105"
        }`}
      >
        Tất cả sản phẩm
      </li>

      {Array.isArray(dataCate) &&
        dataCate.map((item: Category) => (
          <li
            key={item._id}
            onClick={() => handleNavigation("/products")}
            className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
              isSticky
                ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
                : "hover:bg-gray-700 hover:text-white hover:scale-105"
            }`}
          >
            {item.name}
          </li>
        ))}

      <li
        onClick={() => handleNavigation("/vouchers")}
        className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
          isSticky
            ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
            : "hover:bg-gray-700 hover:text-white hover:scale-105"
        }`}
      >
        Khuyến mãi
      </li>
    </ul>
  );
}
