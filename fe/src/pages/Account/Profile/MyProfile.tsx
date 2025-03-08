import {
  ConfigProvider,
  Form,
  FormProps,
  Input,
  message,
  Skeleton,
} from "antd";
import ChangePasswordModal from "./_components/ChangePasswordModal";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
type FieldType = {
  name?: string;
  email?: string;
  tel?: string;
};
const rules = {
  name: [
    { required: true, message: "Họ & Tên không được để trống" },
    { min: 3, message: "Họ & Tên phải có ít nhất 3 ký tự" },
  ],
  tel: [
    { required: true, message: "Số điện thoại không được để trống" },
    { min: 8, message: "Số điện thoại phải có ít nhất 8 ký tự" },
  ],
};
export default function MyProfile() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const id = localStorage.getItem("idUser");

  // Fetch user data từ API
  const { data: userDataApi, isLoading } = useQuery({
    queryKey: ["USER_INFO", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/user_account/${id}`
      );
      return data.data;
    },
    enabled: !!id, // Chỉ chạy khi có ID
  });

  // Cập nhật form khi có dữ liệu từ API
  useEffect(() => {
    if (userDataApi) {
      form.setFieldsValue({
        name: userDataApi.name,
        tel: userDataApi.tel,
      });
    }
  }, [userDataApi, form]);

  // Mutation để cập nhật thông tin
  const { mutate } = useMutation({
    mutationFn: async (values: FieldType) => {
      const { data } = await axios.put(
        `http://localhost:3000/api/update_user_account/${id}`,
        values
      );
      return data;
    },
    onSuccess: (data) => {
      // console.log(data.data.name)
      message.success("Cập nhật thành công");
      // Cập nhật cache và localStorage
      queryClient.setQueryData(["USER_INFO", id], data);
      // localStorage.setItem("dataUser", JSON.stringify({ ...userData, ...data }));
      localStorage.setItem("nameUser", data.data.name);

      queryClient.invalidateQueries({ queryKey: ["USER_INFO", id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  if (isLoading) return <Skeleton />;

  return (
    <div className="border border-gray-200 py-8 px-6">
      <h1 className="uppercase font-bold text-2xl select-none">
        Thông tin cá nhân
      </h1>
      <div className="mt-8">
        <Form
          form={form}
          name="information"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
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
              style={{ maxWidth: 600 }}
            >
              <Input
                placeholder="Nhập Email của bạn"
                className="h-[42px]"
                disabled
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={<span className="font-medium text-sm">Họ & Tên</span>}
              name="name"
              rules={rules.name}
            >
              <Input placeholder="Nhập Họ & Tên" className="h-[42px]" />
            </Form.Item>

            <Form.Item<FieldType>
              label={<span className="font-medium text-sm">Số điện thoại</span>}
              name="tel"
              rules={rules.tel}
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
            {/* <ChangePasswordModal>
              <button
                type="button"
                className="bg-[#110e11] cursor-pointer font-semibold uppercase text-lg py-2 px-12 text-white"
              >
                Đổi mật khẩu
              </button>
            </ChangePasswordModal> */}
          </div>
        </Form>
      </div>
    </div>
  );
}
