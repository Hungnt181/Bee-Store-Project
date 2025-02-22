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
import TextArea from "antd/es/input/TextArea";
import "../../../assets/Css/Admin/Product/page.css";
import Color from "../../../interface/Color";
import Size from "../../../interface/Size";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Category } from "../../../interface/Category";

const AdminProductAdd = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const url = `http://localhost:3000/api/categories`;
  const key = "categories";
  const { data: data_Cate } = useGetAllNotArray<Category>(url, key);

  const url1 = `http://localhost:3000/api/colors`;
  const key1 = "colors";
  const { data: data_Color } = useGetAllNotArray<Color>(url1, key1);

  const url2 = `http://localhost:3000/api/sizes`;
  const key2 = "sizes";
  const { data: data_Size } = useGetAllNotArray<Size>(url2, key2);

  const [form] = Form.useForm();
  useEffect(() => {
    if (data_Color && data_Color.length > 0) {
      form.setFieldsValue({ id_color: data_Color[0]._id });
    }
    if (data_Size && data_Size.length > 0) {
      form.setFieldsValue({ id_size: data_Size[0]._id });
    }
    if (data_Cate && data_Cate.length > 0) {
      form.setFieldsValue({ id_cate: data_Cate[0]._id });
    }
  }, [data_Color, data_Size, data_Cate, form]);

  const queryClient = useQueryClient();

  const { mutate: addProduct } = useMutation({
    mutationFn: async (formData) => {
      if (typeof formData === "undefined") {
        message.error("Form data is undefined");
        return;
      }
      const productData = omit(formData, [
        "image",
        "quantity",
        "id_size",
        "id_color",
        "status",
      ]);
      const response = await axios.post(
        `http://localhost:3000/api/products`,
        productData
      );
      return response.data;
    },
    onSuccess: (product) => {
      message.success("Thêm sản phẩm thành công");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      // Thêm biến thể sau khi thêm sản phẩm thành công
      const variantData = form.getFieldsValue([
        "image",
        "quantity",
        "id_size",
        "id_color",
        "status",
      ]);
      variantData.id_product = product._id; // Gán ID sản phẩm vào biến thể
      addVariant(variantData);
    },
    onError: (error: any) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Error creating product: ${error.response.data.message}`);
      } else {
        message.error("Error creating product");
      }
      console.error(error);
    },
  });

  // Add variant data
  const { mutate: addVariant } = useMutation({
    mutationFn: async (variantData) => {
      await axios.post(`http://localhost:3000/api/variants`, variantData);
    },
    onSuccess: () => {
      message.success("Thêm biến thể thành công");
      queryClient.invalidateQueries({
        queryKey: ["dataPage"],
      });
      form.resetFields();
    },
    onError: (error: any) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Error creating variant: ${error.response.data.message}`);
      } else {
        message.error("Error creating variant");
      }
      console.error(error);
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
        if (prevUrls.length >= 5) {
          message.error("Bạn chỉ có thể tải lên tối đa 5 ảnh.");
          return prevUrls; // Không thêm ảnh mới vào
        }
        const newUrls = [...prevUrls, imageUrl];
        form.setFieldsValue({ image: newUrls });
        return newUrls;
      });
    }
  };

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    const isFormValid =
      values.name &&
      values.price &&
      values.about &&
      values.description &&
      values.quantity &&
      values.id_size &&
      values.id_color &&
      imageUrls.length > 0 &&
      imageUrls.length < 6;
    setIsFormValid(isFormValid);
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
        onFinish={(formData) => {
          addProduct(formData);
        }}
        onValuesChange={onValuesChange}
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
          initialValue={0}
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            { type: "number", min: 0, message: "Giá sản phẩm luôn không âm" },
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
            {data_Cate?.map((item: Category) => (
              <Select.Option key={item._id?.toString()} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Biến thể */}
        {/* upload imga */}
        <Form.Item
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng upload ảnh" }]}
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
          initialValue={0}
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
          initialValue={data_Size?.[0]?._id}
        >
          <Select>
            {data_Size?.map((item: Size) => (
              <Select.Option key={item._id.toString()} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Màu sắc"
          name="id_color"
          initialValue={data_Color?.[0]?._id}
        >
          <Select>
            {data_Color?.map((item: Color) => (
              <Select.Option key={item._id.toString()} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="ButtonForm">
          <Button htmlType="submit" disabled={!isFormValid}>
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminProductAdd;
