import { useQuery } from "@tanstack/react-query";
import { Popover } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { Category } from "../../../../interface/Category";

export default function ListitemCategory({ isSticky }: { isSticky: boolean }) {
  const { data: dataCate } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/categories`);
      return data.data;
    },
  });

  return (
    <ul className="uppercase flex gap-10 flex-1  justify-center text-base font-medium items-center">
      <Link
        to={"/products"}
        className={`py-4 px-4 duration-300 cursor-pointer ${
          isSticky
            ? "text-white hover:text-black hover:bg-white"
            : "hover:bg-black hover:text-white"
        }`}
      >
        Tất cả sản phẩm
      </Link>

      {Array.isArray(dataCate) &&
        dataCate.map((item: Category) => (
          <Popover
            key={item._id}
            arrow={false}
            // content="test"
            placement="bottom"
          >
            <li
              className={`py-4 px-4 duration-300 cursor-pointer ${
                isSticky
                  ? "text-white hover:text-black hover:bg-white"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              {item.name}
            </li>
          </Popover>
        ))}

      <li
        className={`py-4 px-4 duration-300 cursor-pointer ${
          isSticky
            ? "text-white hover:text-black hover:bg-white"
            : "hover:bg-black hover:text-white"
        }`}
      >
        Khuyến mãi
      </li>
    </ul>
  );
}
