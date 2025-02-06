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

const AdminVariantAdd = () => {
  const url = `http://localhost:3000/api/categories`;
  const key = "categories";
  const queryClient = useQueryClient();
  const { data: data_Cate } = useGetAllNotArray<Category>(url, key);

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      await axios.post(`http://localhost:3000/api/products`, formData);
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
        labelCol={{
          span: 4,
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả của sản phẩm" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Switch />
        </Form.Item>

        <Form.Item label="Select" name="id_cate">
          <Select>
            {data_Cate?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit">Thêm</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminVariantAdd;
