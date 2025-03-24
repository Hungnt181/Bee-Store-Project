// import { Popover } from "antd";
// import { Link } from "react-router-dom";

// export default function ListitemCategory({ isSticky }: { isSticky: boolean }) {
//   return (
//     <ul className="uppercase flex gap-8 flex-1 justify-center text-base font-medium items-center">
//       <Link
//         to="/products"
//         className={`py-3 px-5 rounded-md transition-all transform duration-300 ${
//           isSticky
//             ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
//             : "hover:bg-gray-700 hover:text-white hover:scale-105"
//         }`}
//       >
//         Tất cả sản phẩm
//       </Link>

//       {[
//         { label: "Quần thể thao" },
//         { label: "Giày" },
//         { label: "Sandal - Dép - Tông" },
//       ].map((item, index) => (
//         <Popover key={index} arrow={false} content={"test"} placement="bottom">
//           <li
//             className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
//               isSticky
//                 ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
//                 : "hover:bg-gray-700 hover:text-white hover:scale-105"
//             }`}
//           >
//             {item.label}
//           </li>
//         </Popover>
//       ))}

//       <Link
//         to="/products"
//         className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
//           isSticky
//             ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
//             : "hover:bg-gray-700 hover:text-white hover:scale-105"
//         }`}
//       >
//         Khuyến mãi
//       </Link>
//     </ul>
//   );
// }
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";

export default function ListitemCategory({ isSticky }: { isSticky: boolean }) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <ul className="uppercase flex gap-8 flex-1 justify-center text-base font-medium items-center">
      <div
        onClick={() => handleNavigation("/products")}
        className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
          isSticky
            ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
            : "hover:bg-gray-700 hover:text-white hover:scale-105"
        }`}
      >
        Tất cả sản phẩm
      </div>

      {[
        { label: "Quần thể thao" },
        { label: "Giày" },
        { label: "Sandal - Dép - Tông" },
      ].map((item, index) => (
        <Popover key={index} arrow={false} content={"test"} placement="bottom">
          <li
            className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
              isSticky
                ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
                : "hover:bg-gray-700 hover:text-white hover:scale-105"
            }`}
          >
            {item.label}
          </li>
        </Popover>
      ))}

      <div
        onClick={() => handleNavigation("/vouchers")}
        className={`py-3 px-5 rounded-md transition-all transform duration-300 cursor-pointer ${
          isSticky
            ? "text-white hover:text-black bg-transparent hover:bg-white hover:scale-105"
            : "hover:bg-gray-700 hover:text-white hover:scale-105"
        }`}
      >
        Khuyến mãi
      </div>
    </ul>
  );
}
