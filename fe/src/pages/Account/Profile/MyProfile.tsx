import { ConfigProvider, Form, FormProps, Input } from "antd";
import ChangePasswordModal from "./_components/ChangePasswordModal";
type FieldType = {
  userName?: string;
  email?: string;
  phone?: string;
};
const rules = {
  email: [
    { required: true, message: "Email không được để trống" },
    { type: "email" as const, message: "Email không đúng định dạng" },
  ],
  userName: [
    { required: true, message: "Họ & Tên không được để trống" },
    { min: 3, message: "Họ & Tên phải có ít nhất 3 ký tự" },
  ],
  phone: [
    { required: true, message: "Số điện thoại không được để trống" },
    { min: 8, message: "Số điện thoại phải có ít nhất 8 ký tự" },
  ],
};
export default function MyProfile() {
  const initialValues: FieldType = {
    userName: "Hiền Vương",
    email: "HienVuong@gmail.com",
    phone: "082773627",
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  return (
    <div className="border border-gray-200 py-8 px-6">
      <h1 className="uppercase font-bold text-2xl select-none">
        Thông tin cá nhân
      </h1>
      <div className="mt-8">
        <Form
          name="information"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={initialValues}
        >
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  hoverBorderColor: "#2e2e2e",
                  activeBorderColor: "#2e2e2e",
                  activeShadow: "none",
                  paddingInline: 18,
                },
              },
              token: {
                colorBorder: "#2e2e2e",
                borderRadius: 3,
                fontSize: 14,
                colorText: "black",
              },
            }}
          >
            <Form.Item<FieldType>
              label={<span className="font-medium text-sm">Email</span>}
              name="email"
              rules={rules.email}
              style={{ maxWidth: 600 }}
            >
              <Input placeholder="Nhập Email của bạn" className="h-[42px]" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<span className="font-medium text-sm">Họ & Tên</span>}
              name="userName"
              rules={rules.userName}
            >
              <Input placeholder="Nhập Họ & Tên" className="h-[42px]" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<span className="font-medium text-sm">Số điện thoại</span>}
              name="phone"
              rules={rules.phone}
            >
              <Input placeholder="Nhập số điện thoại" className="h-[42px]" />
            </Form.Item>
          </ConfigProvider>

          <div className="mt-10 flex items-center gap-5">
            <button
              type="submit"
              className="bg-[#110e11] hover:opacity-80 duration-300 cursor-pointer font-semibold uppercase text-lg py-2 px-12 text-white"
            >
              LƯU THAY ĐỔI
            </button>
            <ChangePasswordModal>
              <button
                type="button"
                className="bg-[#110e11] cursor-pointer font-semibold uppercase text-lg py-2 px-12 text-white"
              >
                Đổi mật khẩu
              </button>
            </ChangePasswordModal>
          </div>
        </Form>
      </div>
    </div>
  );
}
