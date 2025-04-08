// --- IMPORT ---
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import beeImage from "./anhong.png";
import { useEffect, useState } from "react";
import type { Rule } from "antd/es/form";
// --- VALIDATION RULES ---
const validationRules = {
  email: [
    { required: true, message: "Không bỏ trống email" },
    { type: "email", message: "Không đúng định dạng email" },
  ],
  password: [
    { required: true, message: "Không bỏ trống mật khẩu" },
    { min: 6, message: "Ít nhất 6 kí tự" },
    { max: 25, message: "Tối đa 25 kí tự" },
  ],
};

// --- COMPONENT ---
const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    if (user) {
      navigate(userRole === "admin" ? "/admin" : "/");
    }
  }, [navigate]);

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:3000/api/signin_user`,
          formData
        );
        localStorage.setItem("userRole", response.data.data.role);
        localStorage.setItem("nameUser", response.data.data.name);
        localStorage.setItem("idUser", response.data.data._id);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        return response.data.data.role;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
          );
        } else {
          throw new Error("Có lỗi xảy ra, vui lòng thử lại");
        }
      }
    },
    onSuccess: (role) => {
      message.success("Đăng nhập thành công");
      navigate(role === "admin" ? "/admin" : "/");
    },
    onError: (error) => {
      message.error(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const requestLoginGoogle = async (tokenGoogle: string) => {
    const res = await axios.post(`http://localhost:3000/api/login_google`, {
      tokenGoogle,
    });
    return res.data;
  };

  const handleSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;

    if (!credential) {
      message.error("Không nhận được thông tin từ Google");
      return;
    }

    try {
      const res = await requestLoginGoogle(credential);
      localStorage.setItem("idUser", res.user._id);
      localStorage.setItem("userRole", res.user.role);
      localStorage.setItem("user", JSON.stringify(res.user));
      message.success("Đăng nhập thành công");
      navigate(res.user.role === "admin" ? "/admin" : "/");
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[80vh] bg-gradient-to-r from-blue-100 to-purple-100 py-10">
      <Form
        layout="vertical"
        onFinish={(formData) => mutate(formData)}
        validateTrigger="onBlur"
        className="w-[90vw] max-w-5xl shadow-xl rounded-2xl bg-white overflow-hidden flex flex-col md:flex-row"
      >
        {/* LEFT - IMAGE + LINK */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-300 to-blue-200 p-8 flex flex-col justify-center items-center gap-4">
          <img
            src={beeImage}
            alt="Sign in illustration"
            className="max-w-xs w-full h-auto shadow-lg rounded-lg"
          />
          <Link
            to="/signup"
            className="text-white font-semibold underline hover:text-gray-100"
          >
            Bạn chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>

        {/* RIGHT - FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Đăng nhập
          </h2>

          <Form.Item name="email" rules={validationRules.email as Rule[]}>
            <Input
              className="border-gray-300 py-2 font-all rounded-md"
              placeholder="Email"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item name="password" rules={validationRules.password}>
            <Input.Password
              className="border-gray-300 py-2 font-all rounded-md"
              placeholder="Mật khẩu"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-all"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center mt-2">
            <Link
              to="/forgot"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="text-center my-4 text-gray-500">Hoặc</div>

          <div className="flex justify-center">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                  console.log("Google Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Signin;
