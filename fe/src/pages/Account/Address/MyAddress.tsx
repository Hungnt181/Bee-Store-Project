import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import ModalNewAddress from "./_components/ModalNewAddress";

const demoAddress = [
  {
    userName: "Hiền Vương",
    default: true,
    address: "Phùng Khoang, Nam Từ Liêm, Hà Nội, Việt Nam",
  },
  {
    userName: "Phạm thoại",
    default: false,
    address: "36 Dịch vọng hậu, Cầu Giấy, Hà Nội, Việt Nam",
  },
];

export default function MyAddress() {
  return (
    <div className="border border-gray-200 py-8 px-6">
      <h1 className="uppercase font-bold text-2xl select-none">
        Thông tin giao hàng
      </h1>
      <div className="mt-8 flex flex-col gap-2">
        {/* BOX ADDRESS */}
        {demoAddress.map((item, index) => (
          <div
            key={index}
            className="px-4 border border-gray-200 py-2 rounded-sm"
          >
            <div className="flex justify-between">
              <h3 className="font-bold">{item.userName}</h3>
              <div className="flex items-center gap-2">
                <EditOutlined className="text-xl" />
                {!item.default && <DeleteOutlined className="text-xl"/>}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-500">{item.address}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Checkbox checked={item.default} />{" "}
              {item.default ? "Mặc định" : "Đặt làm địa chỉ mặc định"}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <ModalNewAddress>
          <button
            type="submit"
            className="bg-[#110e11] hover:opacity-80 duration-300 cursor-pointer font-semibold uppercase text-base py-2 px-8 text-white"
          >
            Thêm địa chỉ
          </button>
        </ModalNewAddress>
      </div>
    </div>
  );
}
