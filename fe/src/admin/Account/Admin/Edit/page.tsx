/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Skeleton } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdminAccountEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm();
  const queryClient = useQueryClient();

  // Lấy dữ liệu tài khoản admin dựa vào ID
  const { data, isLoading } = useQuery({
    queryKey: ["ADMINACCOUNTS", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/admin_account/${id}`
      );
      return data.data;
    },
  });

  // Khai báo mutation để cập nhật thông tin tài khoản admin
  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        await axios.put(
          `http://localhost:3000/api/update_admin_account/${id}`,
          formData
        );
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(`Error updating: ${error.response.data.message}`);
        } else {
          message.error("Error updating");
        }
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      message.success("Cập nhật tài khoản admin thành công");
      queryClient.invalidateQueries({ queryKey: ["USER_INFO"] });
      navigate("/admin/admin_account");
    },
  });

  if (isLoading) return <Skeleton></Skeleton>;

  return (
    <div>
      <h1 className="text-3xl mb-5 font-semibold">CẬP NHẬT TÀI KHOẢN ADMIN</h1>
      <Form
        form={form}
        initialValues={data}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        onFinish={(formData) => {
          mutate(formData);
        }}
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Không bỏ trống tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Không bỏ trống email" },
            { type: "email", message: "Không đúng định dạng email" },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Button htmlType="submit">Cập nhật</Button>
      </Form>
    </div>
  );
};

export default AdminAccountEditPage;
