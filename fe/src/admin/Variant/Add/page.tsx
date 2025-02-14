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
import useGetAllNotArray from "../../hooks/useGetAllNotArray";
import Color from "../../../interface/Color";
import Size from "../../../interface/Size";

const AdminVariantAdd = (dataDtPro: any) => {
  const DataDtPro = dataDtPro.dataDtPro;

  const url = `http://localhost:3000/api/colors`;
  const key = "colors";
  const { data: data_Color } = useGetAllNotArray<Color>(url, key);

  const url2 = `http://localhost:3000/api/sizes`;
  const key2 = "sizes";
  const { data: data_Size } = useGetAllNotArray<Size>(url2, key2);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      try {
        await axios.post(`http://localhost:3000/api/variants`, formData);
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
        queryKey: ["variants"],
      });
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
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
        <Form.Item name="id_product" initialValue={DataDtPro._id} hidden>
          <Input />
        </Form.Item>

        <Form.Item label="Tên sản phẩm">
          <Input defaultValue={DataDtPro.name} disabled />
        </Form.Item>

        <Form.Item
          label="Ảnh"
          name="image"
          rules={[{ required: true, message: "Vui lòng nhập ảnh sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            {
              type: "number",
              min: 0,
              message: "Số lượng sản phẩm  luôn không âm",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item label="Kích cỡ" name="id_size">
          <Select>
            {data_Size?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Màu sắc" name="id_color">
          <Select>
            {data_Color?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Switch defaultValue />
        </Form.Item>

        <Form.Item className="ButtonForm">
          <Button htmlType="submit">Thêm</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminVariantAdd;
