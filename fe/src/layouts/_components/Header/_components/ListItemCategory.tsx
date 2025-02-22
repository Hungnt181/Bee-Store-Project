import { Popover } from "antd";
import { Link } from "react-router-dom";

export default function ListitemCategory({ isSticky }: { isSticky: boolean }) {
  return (
    <ul className="uppercase flex gap-10 flex-1  justify-center text-base font-medium items-center">
        <Link to={'/products'}
          className={`py-4 px-4 duration-300 cursor-pointer ${
            isSticky
              ? "text-white hover:text-black hover:bg-white"
              : "hover:bg-black hover:text-white"
          }`}
        >
          Tất cả sản phẩm
        </Link>
      <Popover arrow={false} content={"test"} placement="bottom">
        <li
          className={`py-4 px-4 duration-300 cursor-pointer ${
            isSticky
              ? "text-white hover:text-black hover:bg-white"
              : "hover:bg-black hover:text-white"
          }`}
        >
          Quần thể thao
        </li>
      </Popover>
      <Popover arrow={false} content={"test"} placement="bottom">
        <li
          className={`py-4 px-4 duration-300 cursor-pointer ${
            isSticky
              ? "text-white hover:text-black hover:bg-white"
              : "hover:bg-black hover:text-white"
          }`}
        >
          Giày
        </li>
      </Popover>
      <Popover arrow={false} content={"test"} placement="bottom">
        <li
          className={`py-4 px-4 duration-300 cursor-pointer ${
            isSticky
              ? "text-white hover:text-black hover:bg-white"
              : "hover:bg-black hover:text-white"
          }`}
        >
          sandal- dép- tông
        </li>
      </Popover>
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
