import { ConfigProvider, Form, FormProps, Input, Modal } from "antd";
import { ReactNode, useState } from "react";

const rules = {
  oldPassword: [
    { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
  ],
  newPassword: [
    { required: true, message: "Vui lòng nhập mật khẩu mới" },
    { min: 6, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
  ],
};

export default function ChangePasswordModal({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onFinish: FormProps["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Modal
        centered
        open={isOpen}
        footer={<></>}
        onCancel={handleClose}
        title={
          <h3 className="text-xl font-semibold uppercase">Đổi mật khẩu</h3>
        }
        onClose={handleClose}
      >
        <div className="py-4">
          <Form name="ChangePassword" onFinish={onFinish} autoComplete="off" layout="vertical">
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
              <Form.Item
                label={
                  <span className="font-medium text-sm">Mật khẩu hiện tại</span>
                }
                name="oldPasswoord"
                rules={rules.oldPassword}
                style={{ maxWidth: 600 }}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu hiện tại của bạn"
                  className="h-[42px]"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-sm">Mật khẩu mới</span>
                }
                name="newPassword"
                rules={rules.newPassword}
                style={{ maxWidth: 600 }}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu mới của bạn"
                  className="h-[42px]"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-sm">
                    Xác nhận mật khẩu mới
                  </span>
                }
                name="confirmNewPassword"
                dependencies={["newPassword"]}
                style={{ maxWidth: 600 }}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu mới của bạn"
                  className="h-[42px]"
                />
              </Form.Item>
            </ConfigProvider>

            <button
              type="submit"
              className="bg-[#110e11] hover:opacity-80 w-full duration-300 cursor-pointer font-semibold uppercase text-lg py-2 mt-4 px-12 text-white"
            >
              Xác nhận
            </button>
          </Form>
        </div>
      </Modal>
    </>
  );
}
