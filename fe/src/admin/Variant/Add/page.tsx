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
  Upload,
} from "antd";
import axios from "axios";
import useGetAllNotArray from "../../hooks/useGetAllNotArray";
import Color from "../../../interface/Color";
import Size from "../../../interface/Size";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const AdminVariantAdd = (dataDtPro: any) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const DataDtPro = dataDtPro.dataDtPro;
  const [form] = Form.useForm();

  const url = `http://localhost:3000/api/colors`;
  const key = "colors";
  const { data: data_Color } = useGetAllNotArray<Color>(url, key);

  const url2 = `http://localhost:3000/api/sizes`;
  const key2 = "sizes";
  const { data: data_Size } = useGetAllNotArray<Size>(url2, key2);

  useEffect(() => {
    if (data_Color && data_Color.length > 0) {
      form.setFieldsValue({ id_color: data_Color[0]._id });
    }
    if (data_Size && data_Size.length > 0) {
      form.setFieldsValue({ id_size: data_Size[0]._id });
    }
  }, [data_Color, data_Size, form]);

  const queryClient = useQueryClient();
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

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }

    console.log(e);
    return e?.fileList;
  };

  const onHandleChange = (info: any) => {
    if (info.file.status === "done") {
      const imageUrl = info.file.response.secure_url;
      setImageUrls((prevUrls) => {
        const newUrls = [...prevUrls, imageUrl];
        form.setFieldsValue({ image: newUrls });
        return newUrls;
      });
    }
  };

  const onFinish = (values: any) => {
    console.log("imageUrls", imageUrls);
    values.image = imageUrls; // Cập nhật giá trị của trường image
    console.log("values", values);

    mutate(values);
  };

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
        onFinish={onFinish}
      >
        <Form.Item name="id_product" initialValue={DataDtPro._id} hidden>
          <Input />
        </Form.Item>

        <Form.Item label="Tên sản phẩm">
          <Input defaultValue={DataDtPro.name} disabled />
        </Form.Item>

        {/* upload imga */}
        <Form.Item
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            action="https://api.cloudinary.com/v1_1/ddjylufrj/image/upload"
            listType="picture-card"
            multiple
            data={{
              upload_preset: "reactJS",
            }}
            onChange={onHandleChange}
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            {
              type: "number",
              min: 0,
              message: "Số lượng sản phẩm luôn không âm",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Kích cỡ"
          name="id_size"
          rules={[{ required: true, message: "Vui lòng chọn kích cỡ" }]}
        >
          <Select>
            {data_Size?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Màu sắc"
          name="id_color"
          rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
        >
          <Select>
            {data_Color?.map((item: any) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item className="ButtonForm">
          <Button htmlType="submit">Thêm</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminVariantAdd;
