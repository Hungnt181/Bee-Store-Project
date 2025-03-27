import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import beeImage from "./anhong.png";
import { useState } from "react";
import type { RuleObject, Rule } from "antd/es/form";
import type { StoreValue } from "antd/es/form/interface";

// 🎯 Tách riêng rules
const formRules = {
  name: [{ required: true, message: "Không bỏ trống họ tên" }],
  email: [
    { required: true, message: "Không bỏ trống email" },
    { type: "email", message: "Email không hợp lệ" },
  ],
  tel: [
    { required: true, message: "Không bỏ trống số điện thoại" },
    {
      pattern: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
      message: "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)",
    },
  ],
  password: [
    { required: true, message: "Không bỏ trống mật khẩu" },
    { min: 6, message: "Ít nhất 6 ký tự" },
    { max: 25, message: "Tối đa 25 ký tự" },
    {
      validator(_: RuleObject, value: StoreValue) {
        if (/\s/.test(value)) {
          return Promise.reject("Mật khẩu không được chứa dấu cách");
        }
        return Promise.resolve();
      },
    },
  ],
  confirmPassword: (getFieldValue: (name: string) => StoreValue) => [
    { required: true, message: "Nhập lại mật khẩu" },
    {
      validator(_: RuleObject, value: StoreValue) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject("Mật khẩu không trùng khớp");
      },
    },
  ],
};

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        setLoading(true);
        await axios.post(`http://localhost:3000/api/signup_user`, formData);
      } catch (error: unknown) {
        if (
          error instanceof AxiosError &&
          error.response?.data?.errors &&
          typeof error.response.data.errors === "object"
        ) {
          const fieldErrors = error.response.data.errors;
          // đổ lỗi chi tiết vào từng form field
          Object.entries(fieldErrors).forEach(([field, messageText]) => {
            form.setFields([
              {
                name: field,
                errors: [messageText as string],
              },
            ]);
          });
        } else if (
          error instanceof AxiosError &&
          error.response?.data?.message
        ) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error("Có lỗi xảy ra, vui lòng thử lại");
        }
      }
    },
    onSuccess: () => {
      message.success(
        "Đăng ký thành công, vui lòng kiểm tra email để xác nhận tài khoản"
      );
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    },
    onError: (error) => {
      message.error(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return (
    <div className="min-h-[650px] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side - Form */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Đăng ký
          </h2>
          <Form
            layout="vertical"
            form={form}
            onFinish={(formData) => mutate(formData)}
            validateTrigger="onBlur" // 👉 chỉ hiển thị lỗi sau khi rời khỏi ô input
          >
            <Form.Item
              name="name"
              rules={formRules.name}
              normalize={(value) => value?.replace(/^\s+/, "")}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Họ tên"
                className="py-2"
              />
            </Form.Item>

            <Form.Item name="email" rules={formRules.email as Rule[]}>
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              name="tel"
              rules={formRules.tel}
              normalize={(value) => value?.replace(/\s+/g, "")}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Số điện thoại"
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={formRules.password}
              normalize={(value) => value?.replace(/\s/g, "")}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={formRules.confirmPassword(form.getFieldValue)}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu"
                className="py-2"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl text-lg"
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Right side - Image and redirect */}
        <div className="bg-gradient-to-br from-pink-200 via-white to-blue-200 flex flex-col items-center justify-center p-6">
          <img
            src={beeImage}
            alt="Illustration"
            className="w-64 md:w-80 rounded-xl shadow-lg mb-6"
          />
          <p className="text-gray-700 mb-2">Bạn đã có tài khoản?</p>
          <Link
            to="/signin"
            className="text-blue-600 hover:underline font-semibold"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
