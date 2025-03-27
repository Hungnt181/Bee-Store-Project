import { ConfigProvider, Form, FormProps, Input, Modal, message } from "antd";
import { ReactNode, useState } from "react";
import { LockOutlined } from "@ant-design/icons";

const rules = {
  oldPassword: [
    { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
    { pattern: /^\S+$/, message: "Mật khẩu không được chứa dấu cách" },
  ],
  newPassword: [
    { required: true, message: "Vui lòng nhập mật khẩu mới" },
    { min: 6, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
    { pattern: /^\S+$/, message: "Mật khẩu không được chứa dấu cách" },
  ],
};

interface ChangePasswordModalProps {
  children: ReactNode;
}

export default function ChangePasswordModal({
  children,
}: ChangePasswordModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 🔁 Loading state

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    form.resetFields();
    setLoading(false);
    setOpen(false);
  };

  const onFinish: FormProps["onFinish"] = async (values) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?._id;

    if (!userId) return message.error("Không tìm thấy ID người dùng.");

    try {
      setLoading(true); // Start loading
      const res = await fetch(
        `http://localhost:3000/api/update_password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        message.success(data.message);
        handleClose();
      } else {
        message.error(data.message || "Lỗi đổi mật khẩu");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến server.");
      console.error("Password change error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\s/g, "");
  };

  const preventSpaceKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") e.preventDefault();
  };

  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Modal
        centered
        open={isOpen}
        footer={null}
        onCancel={handleClose}
        title={null}
        className="rounded-xl"
        closable={false}
      >
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            🔐 Đổi mật khẩu
          </h2>
          <Form
            form={form}
            name="ChangePassword"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="space-y-4"
          >
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    hoverBorderColor: "#7c3aed",
                    activeBorderColor: "#7c3aed",
                    activeShadow: "none",
                    paddingInline: 16,
                  },
                },
                token: {
                  colorBorder: "#d9d9d9",
                  borderRadius: 10,
                  fontSize: 14,
                  colorText: "#1f1f1f",
                },
              }}
            >
              <Form.Item
                label={
                  <span className="font-medium text-sm">Mật khẩu hiện tại</span>
                }
                name="oldPassword"
                rules={rules.oldPassword}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="h-[44px] rounded-xl"
                  onKeyDown={preventSpaceKey}
                  onChange={handlePasswordInput}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-sm">Mật khẩu mới</span>
                }
                name="newPassword"
                rules={rules.newPassword}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu mới"
                  className="h-[44px] rounded-xl"
                  onKeyDown={preventSpaceKey}
                  onChange={handlePasswordInput}
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
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu mới",
                  },
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
                  prefix={<LockOutlined />}
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-[44px] rounded-xl"
                  onKeyDown={preventSpaceKey}
                  onChange={handlePasswordInput}
                />
              </Form.Item>
            </ConfigProvider>

            <button
              type="submit"
              className="w-full py-2 mt-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-xl text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full py-2 mt-2 border border-gray-300 text-gray-700 rounded-xl text-base font-medium hover:bg-gray-100 transition"
            >
              Hủy
            </button>
          </Form>
        </div>
      </Modal>
    </>
  );
}
