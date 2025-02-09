import {
  FacebookFilled,
  GoogleCircleFilled,
  InstagramFilled,
  RightOutlined,
  TwitterCircleFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black ">
      {/* CONTAINER */}
      <div className="max-w-[1240px] mx-6 xl:mx-auto py-8">
        {/* LINE 1 IN FOOTER */}
        <div className="flex  justify-between">
          <div className="mt-20">
            <img className="w-2xs invert-35" src="./public/logo.png" alt="" />
          </div>
          <div className="border-l-[1px] border-[#6d6d6d] pl-6">
            <h3 className="text-white font-medium uppercase">
              Hỗ trợ khách hàng
            </h3>
            <ul className="text-[#d0d0d0] mt-6 flex flex-col justify-center gap-4">
              <li>
                <Link to={"/"} className="text-sm flex items-center gap-2">
                  <RightOutlined className="text-xs" />
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-sm flex items-center gap-2">
                  <RightOutlined className="text-xs" />
                  Chính sách kiểm hàng
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-sm flex items-center gap-2">
                  <RightOutlined className="text-xs" />
                  Chính sách đổi trả và hoàn tiền
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-sm flex items-center gap-2">
                  <RightOutlined className="text-xs" />
                  Chính sách vận chuyển và giao nhận
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-sm flex items-center gap-2">
                  <RightOutlined className="text-xs" />
                  Chính sách xử lý khiếu nại
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-sm flex items-center gap-2">
                  <RightOutlined className="text-xs" />
                  Chính sách thanh toán
                </Link>
              </li>
            </ul>
          </div>
          <div className="border-l-[1px] border-[#6d6d6d] pl-6">
            <h3 className="text-white font-medium uppercase">
              Kết nối với beestore
            </h3>
            <ul className="text-[#d0d0d0] mt-6 flex flex-col justify-center gap-4">
              <li>
                <Link to={"/"} className="text-xl flex items-center gap-2">
                  <GoogleCircleFilled className="text-2xl" />
                  <span className="text-sm font-medium">Google</span>
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-xl flex items-center gap-2">
                  <FacebookFilled className="text-2xl" />
                  <span className="text-sm font-medium">Facebook</span>
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-xl flex items-center gap-2">
                  <InstagramFilled className="text-2xl" />
                  <span className="text-sm font-medium">Instagram</span>
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-xl flex items-center gap-2">
                  <YoutubeFilled className={"text-2xl"} />
                  <span className="text-sm font-medium">Instagram</span>
                </Link>
              </li>
              <li>
                <Link to={"/"} className="text-xl flex items-center gap-2">
                  <TwitterCircleFilled className={"text-2xl"} />
                  <span className="text-sm font-medium">Instagram</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
       {/* HR */}
       <div className="w-full mt-2 h-[1px] bg-[#6d6d6d] "/>
       {/* LINE 2 */}
       <div className="max-w-[1240px] mx-6 xl:mx-auto font-stretch-100%">
            <h3 className="text-center text-white text-sm mt-4">Hỗ Trợ Kinh Doanh Thời Trang BEESTORE - MST số 012345678 do UBND quận Nam Từ Liêm cấp ngày 09/02/2090</h3>
            <p className="text-center text-white text-sm">Địa chỉ: Số 9 Đường Trịnh Văn Bô, Quận Nam Từ Liêm, Thành Phố Hà Nội</p>
            <p className="text-center text-white text-sm">HotLine: 012345678910JQKA</p>
            <p className="text-center text-white text-sm">Mail: Beestore@gmail.com</p>
            <p className="text-center mt-14 pb-4 text-white text-sm">Thiết kế web bởi đội ngũ sinh viên FPOLY</p>
       </div>
    </footer>
  );
}
