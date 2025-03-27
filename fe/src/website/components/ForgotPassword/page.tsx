import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import "../../../assets/Css/Website/Signup/style.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async (formData: { email: string }) => {
      setLoading(true);
      try {
        const res = await axios.post(
          `http://localhost:3000/api/forgot_password`,
          formData
        );
        return res.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error("Có lỗi xảy ra, vui lòng thử lại");
        }
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      message.success(" Vui lòng kiểm tra hòm thư để đặt lại mật khẩu!");
      navigate("/signin");
    },
    onError: (error: Error) => {
      message.error(`${error.message}`);
    },
  });

  return (
    <div className="flex justify-center items-center w-full h-[70vh] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <Form
        layout="vertical"
        onFinish={(formData) => mutate(formData)}
        className="w-[80vw] max-w-2xl shadow-xl rounded-xl bg-white"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 font-all">
            🔐 Quên mật khẩu
          </h2>
          <p className="text-center text-gray-600 mb-6 font-all">
            Nhập địa chỉ email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
          </p>

          <Form.Item
            name="email"
            label={<span className="font-medium font-all">Email</span>}
            rules={[
              {
                required: true,
                message: "Không bỏ trống email",
              },
              {
                type: "email",
                message: "Email không đúng định dạng",
              },
            ]}
          >
            <Input
              placeholder="example@email.com"
              prefix={<MailOutlined />}
              className="border-0 border-b border-gray-400 rounded-none py-2 focus:outline-none font-all"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 py-3 font-semibold rounded-lg font-all"
            >
              {loading ? "Đang gửi..." : "Lấy lại mật khẩu"}
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-600 font-all mt-4">
            <div>
              Đã có tài khoản?{" "}
              <Link
                to="/signin"
                className="text-blue-500 hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </div>
            <div className="mt-2">
              Bạn chưa đăng ký?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:underline font-medium"
              >
                Tạo tài khoản mới
              </Link>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
