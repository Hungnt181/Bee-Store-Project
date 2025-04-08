/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import "../../../../assets/Css/Admin/User/page.css";
const AdminAccountAdd = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        await axios.post(`http://localhost:3000/api/signup_admin`, formData);
        form.resetFields();
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(`${error.response.data.message}`);
        } else {
          message.error("Error creating");
        }
        console.log(error);
        throw error; // Ném lại lỗi để đảm bảo onSuccess không được gọi
      }
    },

    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({
        queryKey: ["ADMINACCOUNTS"],
      });
    },
  });
  return (
    <div>
      <Form
        form={form}
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
          rules={[
            {
              required: true,
              message: "Không bỏ trống tên",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Không bỏ trống email",
            },
            {
              type: "email",
              message: "Không đÚng định dạng email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Không bỏ trống mật khẩu",
            },
            {
              min: 6,
              message: "Mật khẩu có ít nhất 6 kí tự",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Không bỏ trống",
            },
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
          <Input.Password />
        </Form.Item>
        <Form.Item className="ButtonForm">
          <Button htmlType="submit" type="primary">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAccountAdd;
