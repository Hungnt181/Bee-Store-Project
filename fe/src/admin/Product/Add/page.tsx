/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
} from "antd";
import axios from "axios";
import Category from "../../../interface/Category";
import useGetAllNotArray from "../../hooks/useGetAllNotArray";
import TextArea from "antd/es/input/TextArea";
import "../../../assets/Css/Admin/Product/page.css";
const AdminProductAdd = () => {
  const url = `http://localhost:3000/api/categories`;
  const key = "categories";
  const { data: data_Cate } = useGetAllNotArray<Category>(url, key);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        await axios.post(`http://localhost:3000/api/products`, formData);
        form.resetFields();
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(`Error creating: ${error.response.data.message}`);
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
        queryKey: ["products"],
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
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            { type: "number", min: 0, message: "Giá sản phẩm  luôn không âm" },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Giới thiệu"
          name="about"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thông tin giới thiệu sản phẩm",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả của sản phẩm" },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item label="Danh mục" name="id_cate">
          <Select>
            {data_Cate?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="ButtonForm">
          <Button htmlType="submit">Thêm</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminProductAdd;
