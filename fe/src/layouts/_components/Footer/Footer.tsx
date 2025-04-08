import {
  FacebookFilled,
  GoogleCircleFilled,
  InstagramFilled,
  RightOutlined,
  TwitterCircleFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div
            onClick={() => handleNavigation("/")}
            className="cursor-pointer text-center md:text-left mb-6 md:mb-0"
          >
            <h3 className="text-4xl md:text-5xl font-bold">
              <span className="text-yellow-400">BEE </span>
              <span className="text-white">STORE</span>
            </h3>
            <p className="text-gray-400 mt-2 text-sm">Kinh Doanh Thời Trang</p>
          </div>

          {/* Customer Support */}
          <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-8">
            <h4 className="text-lg font-semibold mb-4 uppercase">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2">
              {[
                "Chính sách bảo mật thông tin",
                "Chính sách kiểm hàng",
                "Chính sách đổi trả và hoàn tiền",
                "Chính sách vận chuyển và giao nhận",
                "Chính sách xử lý khiếu nại",
                "Chính sách thanh toán",
              ].map((policy, index) => (
                <li key={index}>
                  <Link
                    to={"/"}
                    className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center"
                  >
                    <RightOutlined className="mr-2 text-xs" />
                    {policy}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Connections */}
          <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-8">
            <h4 className="text-lg font-semibold mb-4 uppercase">
              Kết nối với beestore
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <GoogleCircleFilled />, name: "Google" },
                { icon: <FacebookFilled />, name: "Facebook" },
                { icon: <InstagramFilled />, name: "Instagram" },
                { icon: <YoutubeFilled />, name: "Youtube" },
                { icon: <TwitterCircleFilled />, name: "Twitter" },
              ].map((social, index) => (
                <Link
                  key={index}
                  to={"/"}
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <span className="text-2xl">{social.icon}</span>
                  <span className="text-sm">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-[1px] bg-gray-700 my-8" />

        {/* Footer Bottom */}
        <div className="text-center text-sm text-gray-400 space-y-2">
          <p>
            Kinh Doanh Thời Trang BEESTORE - MST số 012345678 do UBND quận Nam
            Từ Liêm cấp ngày 09/02/2025
          </p>
          <p>
            Địa chỉ: Số 13 Đường Trịnh Văn Bô, Quận Nam Từ Liêm, Thành Phố Hà
            Nội
          </p>
          <div className="space-x-4">
            <span>HotLine: 0388889999</span>
            <span>Email: support@beestore.vn</span>
          </div>
          <p className="pt-4 text-gray-500">Bee-Store ©2025 Created by WD-25</p>
        </div>
      </div>
    </footer>
  );
}
