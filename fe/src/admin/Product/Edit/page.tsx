/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
  Switch,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductEditPage = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [form] = useForm();
  const { data, isLoading } = useQuery({
    queryKey: ["PRODUCTS", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/products/${id}`
      );
      return data.data;
    },
  });

  const { data: data_Cate } = useQuery({
    queryKey: ["Categories"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/categories`);
      return data.data;
    },
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ id_cate: data.id_cate._id });
    }
  }, [data, form]);
  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        await axios.put(`http://localhost:3000/api/products/${id}`, formData);
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
      message.success("Cập nhật sản phẩm thành công");
      nav("/admin/product");
    },
  });
  if (isLoading) return <Skeleton></Skeleton>;
  return (
    <div>
      <Form
        form={form}
        initialValues={data}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
          margin: "0 auto",
        }}
        onFinish={(formData) => {
          mutate(formData);
        }}
      >
        <h3
          style={{
            fontWeight: "500",
            fontSize: "24px",
            marginLeft: "30%",
          }}
        >
          Chỉnh sửa thông tin
        </h3>
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
          <Switch defaultValue={data.status} />
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

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button htmlType="submit">Edit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEditPage;
