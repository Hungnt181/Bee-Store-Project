/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
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
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Size from "../../../interface/Size";
import Color from "../../../interface/Color";

const VariantEditPage = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  const nav = useNavigate();
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

  useEffect(() => {
    if (data_Color && data_Color.length > 0) {
      form.setFieldsValue({ id_color: data_Color[0]._id });
    }
    if (data_Size && data_Size.length > 0) {
      form.setFieldsValue({ id_size: data_Size[0]._id });
    }
  }, [data_Color, data_Size, form]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data && data[0]?.image) {
      form.setFieldsValue({
        id_color: data[0]?.id_color._id,
        id_size: data[0]?.id_size._id,
        id_product: data[0]?.id_product._id,
        quantity: data[0]?.quantity,
        status: data[0]?.status,
      });
    }

    const imageFiles =
      data[0]?.image.map((url: string, index: number) => ({
        uid: index.toString(),
        name: `image-${index}.jpg`,
        status: "done",
        url, // URL ảnh hiện có
      })) || [];
    setFileList(imageFiles);
    setImageUrls(data[0]?.image); // Giữ lại URL ảnh cũ
  }, [data, form]);

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
          message.error(`Error editing: ${error.response.data.message}`);
        } else {
          message.error("Error editing");
        }
        console.log(error);
        throw error; // Ném lại lỗi để đảm bảo onSuccess không được gọi
      }
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
      nav(`/admin/${data[0]?.id_product._id}/variant`);
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
    const newFileList = [...info.fileList]; // Cập nhật danh sách fileList
    setFileList(newFileList);
    if (info.file.status === "done") {
      const imageUrl = info.file.response.secure_url;
      setImageUrls((prevUrls) => {
        const newUrls = [...prevUrls, imageUrl];
        form.setFieldsValue({ image: newUrls });
        return newUrls;
      });
    }
  };

  const handleRemove = async (file: any) => {
    const id_variant = data[0]?._id;
    if (file.status === "done") {
      try {
        const { data } = await axios.patch(
          `http://localhost:3000/api/variants/${id_variant}?imageUrl=${file.url}`
        );
        // console.log("response", data.data);
        setImageUrls(data.data);
        const imageUrl = file.response?.secure_url; // Lấy URL từ phản hồi của server
        setImageUrls((prevUrls) => {
          const newUrls = prevUrls.filter((url) => url !== imageUrl); // Lọc URL đã xóa
          form.setFieldsValue({ image: newUrls }); // Cập nhật trường 'image' trong form
          return newUrls;
        });
      } catch (error) {
        message.error("Failed to update variant data." + error);
      }
    }
  };

  const onFinish = (values: any) => {
    // console.log("imageUrls", imageUrls);
    values.image = imageUrls; // Cập nhật giá trị của trường image
    // console.log("values", values);

    mutate(values);
  };

  if (isLoading || !data) return <Skeleton></Skeleton>;

  return (
    <div className="form_edit">
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
          margin: "0 auto",
        }}
        onFinish={onFinish}
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

        <Form.Item name="id_product" hidden>
          <Input />
        </Form.Item>

        {/* upload image  */}
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
            fileList={fileList || []}
            onChange={onHandleChange}
            onRemove={handleRemove}
            // defaultFileList={defaultFileList}
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        {/*  */}
        <Form.Item
          label="Kích cỡ"
          name="id_size"
          rules={[{ required: true, message: "Vui lòng chọn kích cỡ" }]}
        >
          <Select>
            {data_Size?.map((item: Size) => (
              <Select.Option key={item._id.toString()} value={item._id}>
                {item.name.toString()}
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
            {data_Color?.map((item: Color) => (
              <Select.Option key={item._id.toString()} value={item._id}>
                {item.name.toString()}
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
          <Switch defaultChecked={data[0]?.status} />
        </Form.Item>
        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button htmlType="submit">Edit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VariantEditPage;
