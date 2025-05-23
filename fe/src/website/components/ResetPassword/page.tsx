import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Result } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // Kiểm tra token có hợp lệ không
  const { isLoading } = useQuery({
    queryKey: ["verifyToken", token],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reset-password/verify/${token}`);
        setIsTokenValid(response.data.valid);
        return response.data;
      } catch (error) {
        setIsTokenValid(false);
        throw error;
      }
    },
    retry: false
  });

  const { mutate } = useMutation<boolean, Error, ResetPasswordForm>({
    mutationFn: async (formData) => {
      if (!token) throw new Error("Liên kết không hợp lệ hoặc đã hết hạn");

      try {
        await axios.post(
          `http://localhost:3000/api/reset-password/reset/${token}`,
          { password: formData.password }
        );
        return true;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error("Có lỗi xảy ra, vui lòng thử lại");
        }
      }
    },
    onSuccess: () => {
      message.success("Cập nhật mật khẩu thành công");
      navigate("/signin");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[70vh]">Đang kiểm tra...</div>;
  }

  if (isTokenValid === false) {
    return (
      <Result
        status="error"
        title="Liên kết đã hết hạn"
        subTitle="Liên kết đặt lại mật khẩu của bạn không hợp lệ hoặc đã hết hạn (5 phút)."
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => navigate("/forgot-password")}
            className="bg-blue-500"
          >
            Yêu cầu lại
          </Button>,
        ]}
      />
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-[70vh] bg-gray-100">
      <Form
        layout="vertical"
        onFinish={(formData) => mutate(formData)}
        className="w-[80vw] max-w-2xl shadow-md rounded-lg bg-white"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Đặt lại mật khẩu
          </h2>
          <p className="text-center text-gray-600 mb-6 font-all">
            Vui lòng nhập mật khẩu mới của bạn
          </p>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Không bỏ trống mật khẩu" },
              { min: 6, message: "Ít nhất 6 kí tự" },
              { max: 25, message: "Tối đa 25 kí tự" },
            ]}
          >
            <Input.Password
              className="border-0 border-b border-black rounded-none input py-2 font-all"
              placeholder="Mật khẩu"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Không trùng khớp mật khẩu"));
                },
              }),
            ]}
          >
            <Input.Password
              className="border-0 border-b border-black rounded-none input py-2 mt-2 font-all"
              placeholder="Nhập lại mật khẩu"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button w-full bg-blue-500 hover:bg-blue-600 py-4 rounded-md mt-4 font-all"
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;