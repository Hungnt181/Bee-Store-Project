import { useEffect, useState } from "react";
import {
  ConfigProvider,
  Form,
  FormProps,
  Input,
  message,
  Skeleton,
  Modal,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axios from "axios";
import ChangePasswordModal from "./_components/ChangePasswordModal";
import { RuleObject } from "antd/es/form";

type FieldType = {
  name?: string;
  email?: string;
  tel?: string;
  address?: string;
};

const rules = {
  name: [
    { required: true, message: "Họ & Tên không được để trống" },
    { min: 3, message: "Họ & Tên phải có ít nhất 3 ký tự" },
    {
      pattern: /^[A-Za-zÀ-ỹ\s]+$/,
      message: "Họ & Tên không được chứa số hoặc ký tự đặc biệt",
    },
  ],
  tel: [
    { required: true, message: "Số điện thoại không được để trống" },
    {
      pattern: /^(0|\+84)(\d{9})$/,
      message:
        "Số điện thoại không hợp lệ (bắt đầu bằng 0 hoặc +84, gồm 10 số)",
    },
  ],
  address: [
    { required: true, message: "Địa chỉ không được để trống" },
    {
      validator: (_: RuleObject, value: string) => {
        if (!value || value.trim() === "") {
          return Promise.reject("Địa chỉ không được chỉ chứa khoảng trắng");
        }
        if (value.trim().length < 5) {
          return Promise.reject("Địa chỉ phải có ít nhất 5 ký tự");
        }
        return Promise.resolve();
      },
    },
  ],
};

export default function MyProfile() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const id = localStorage.getItem("idUser");

  const { data: userDataApi, isLoading } = useQuery({
    queryKey: ["USER_INFO", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/user_account/${id}`
      );
      return data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (userDataApi) {
      form.setFieldsValue({
        name: userDataApi.name,
        tel: userDataApi.tel,
        email: userDataApi.email,
        address: userDataApi.address,
      });
    }
  }, [userDataApi, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FieldType) => {
      const { email, ...updateData } = values;
      void email;
      const { data } = await axios.put(
        `http://localhost:3000/api/update_user_account/${id}`,
        updateData
      );
      return data;
    },
    onSuccess: (data) => {
      message.success("Cập nhật thành công");
      const updatedData = {
        ...data.data,
        email: userDataApi?.email || form.getFieldValue("email"),
      };
      queryClient.setQueryData(["USER_INFO", id], {
        ...data,
        data: updatedData,
      });
      localStorage.setItem("nameUser", data.data.name);
      queryClient.invalidateQueries({ queryKey: ["USER_INFO", id] });
      setTimeout(() => {
        setIsEditing(false);
      }, 1000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
    if (userDataApi) {
      form.setFieldsValue({
        name: userDataApi.name,
        tel: userDataApi.tel,
        address: userDataApi.address,
      });
    }
  };

  if (!id) {
    return (
      <div className="text-center text-red-500 mt-10">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl font-bold">
              {userDataApi?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {userDataApi?.name || "Tên người dùng"}
              </h1>
              <p className="text-white/80 text-sm">{userDataApi?.email}</p>
            </div>
          </div>
          <button
            onClick={handleEditClick}
            className="mt-4 sm:mt-0 bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg transition-all font-medium"
          >
            ✏️ Chỉnh sửa
          </button>
        </div>

        {/* Thông tin chi tiết */}
        <div className="p-8 space-y-6">
          <ProfileField label="Họ & Tên" value={userDataApi?.name} />
          <ProfileField label="Số điện thoại" value={userDataApi?.tel} />
          <ProfileField
            label="Địa chỉ"
            value={userDataApi?.address || "Chưa cập nhật"}
          />
          <div className="pt-4 border-t border-gray-200">
            <ChangePasswordModal>
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                🔒 Đổi mật khẩu
              </button>
            </ChangePasswordModal>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        open={isEditing}
        onCancel={handleCancelEdit}
        footer={null}
        maskClosable={false}
        destroyOnClose
        centered
        title={null}
        className="rounded-xl"
      >
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            ✏️ Chỉnh sửa thông tin
          </h2>

          <Form
            form={form}
            name="information"
            onFinish={onFinish}
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
                  colorBorder: "#d1d5db",
                  borderRadius: 10,
                  fontSize: 14,
                  colorText: "#1f1f1f",
                },
              }}
            >
              <Form.Item<FieldType>
                label={<span className="font-medium text-sm">Email</span>}
                name="email"
              >
                <Input
                  disabled
                  className="h-[44px] rounded-xl text-gray-500 bg-gray-100 cursor-not-allowed"
                />
              </Form.Item>

              <Form.Item<FieldType>
                label={<span className="font-medium text-sm">Họ & Tên</span>}
                name="name"
                rules={rules.name}
                getValueFromEvent={(e) => e.target.value.replace(/^\s+/, "")}
              >
                <Input className="h-[44px] rounded-xl" />
              </Form.Item>

              <Form.Item<FieldType>
                label={
                  <span className="font-medium text-sm">Số điện thoại</span>
                }
                name="tel"
                rules={rules.tel}
              >
                <Input className="h-[44px] rounded-xl" />
              </Form.Item>

              <Form.Item<FieldType>
                label={
                  <span className="font-medium text-sm">Địa chỉ cụ thể</span>
                }
                name="address"
                rules={rules.address}
                getValueFromEvent={(e) => e.target.value.replace(/^\s+/, "")}
              >
                <Input className="h-[44px] rounded-xl" />
              </Form.Item>
            </ConfigProvider>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold py-2.5 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-gray-100 px-5 py-3 rounded-lg">
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-base font-semibold text-gray-800">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
}
