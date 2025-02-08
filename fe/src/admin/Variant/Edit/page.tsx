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
import { useParams } from "react-router-dom";

const VariantEditPage = () => {
  const [form] = useForm();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["variant", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/variants/${id}?_embed=id_product,id_size,id_color`
      );
      return data.variants;
    },
  });

  const { data: data_Size } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/sizes`);
      return data.data;
    },
  });

  const { data: data_Color } = useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/colors`);
      return data.data;
    },
  });

  // console.log("id", data.id_product);

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        await axios.put(`http://localhost:3000/api/variants/${id}`, formData);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(`Error eaditing: ${error.response.data.message}`);
        } else {
          message.error("Error eaditing");
        }
        console.log(error);
        throw error; // Ném lại lỗi để đảm bảo onSuccess không được gọi
      }
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
    },
  });

  if (isLoading) return <Skeleton></Skeleton>;

  return (
    <div>
      <Form
        form={form}
        initialValues={data[0]}
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
          name="id_product"
          initialValue={data[0].id_product._id}
          hidden
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ảnh "
          name="image"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Kích cỡ" name="id_size">
          <Select defaultValue="Test">
            {data_Size?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Màu sắc" name="id_color">
          <Select defaultValue="Test">
            {data_Color?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            { type: "number", min: 0, message: "Giá sản phẩm  luôn không âm" },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Switch defaultValue={data.status} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Edit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VariantEditPage;
