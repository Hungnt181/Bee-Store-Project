import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  Button,
  message,
  Upload,
  Typography,
  Row,
  Col,
  Input,
  Spin,
  Divider,
} from "antd";
import { useState } from "react";
import {
  ArrowLeftOutlined,
  InboxOutlined,
  LinkOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import type { RcFile } from "antd/es/upload/interface";
import { Banner } from "../../../interface/Banner";

const { Title, Text } = Typography;
const { Dragger } = Upload;

// Use environment variables instead of hardcoding
const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dstqlzxaw";
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "banners_upload";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Define data types
interface BannerData {
  imageUrl: string;
}

interface CloudinaryResponse {
  secure_url: string;
  [key: string]: string | number | boolean | object;
}
interface CloudinaryErrorResponse {
  error?: {
    message?: string;
  };
}
const AdminBannerAdd: React.FC = () => {
  const [banner, setBanner] = useState<BannerData>({ imageUrl: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation to add banner to database
  const addBannerMutation = useMutation<Banner, Error, BannerData>({
    mutationFn: async (newBanner: BannerData) => {
      const response = await axios.post(`${API_URL}/banners`, newBanner);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      message.success("Thêm banner thành công");
      setBanner({ imageUrl: "" });
      form.resetFields();
      navigate("/admin/banner");
    },
    onError: (error) => {
      console.error("Error adding banner:", error);
      message.error("Không thể thêm banner. Vui lòng thử lại sau.");
    },
  });

  // Direct upload with Cloudinary (frontend)
  const handleCloudinaryUpload = async (
    file: RcFile
  ): Promise<CloudinaryResponse | null> => {
    if (!file) return null;

    setLoading(true);
    message.loading({ content: "Đang tải ảnh lên...", key: "uploadStatus" });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      console.log("Upload response:", response.data);

      const imageUrl = response.data.secure_url;
      setBanner({ imageUrl });
      form.setFieldsValue({ imageUrl });

      message.success({
        content: "Tải ảnh lên thành công",
        key: "uploadStatus",
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error("Upload error details:", err.response?.data || err);

      const errorMessage =
        err.response?.data && typeof err.response.data === "object"
          ? (err.response.data as CloudinaryErrorResponse)?.error?.message ||
            "Unknown error"
          : err.message;

      message.error({
        content: `Tải ảnh lên thất bại: ${errorMessage}`,
        key: "uploadStatus",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (): void => {
    navigate("/admin/banner");
  };

  const handleSubmit = (values: { imageUrl: string }): void => {
    addBannerMutation.mutate({ imageUrl: values.imageUrl });
  };

  // Handle image URL changes
  const handleImageUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const url = e.target.value;
    setBanner({ imageUrl: url });
    form.setFieldsValue({ imageUrl: url });
  };

  // Handle clearing the image
  const handleClearImage = (): void => {
    setBanner({ imageUrl: "" });
    form.setFieldsValue({ imageUrl: "" });
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file: RcFile) => {
      // Check file format
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ chấp nhận file hình ảnh!");
        return Upload.LIST_IGNORE;
      }

      // Check file size (10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Kích thước ảnh phải nhỏ hơn 10MB!");
        return Upload.LIST_IGNORE;
      }

      // Auto upload
      handleCloudinaryUpload(file);
      return false; // Prevent default upload behavior
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={handleBack}
          className="mr-4 flex items-center justify-center"
          size="large"
        />
        <Title level={3} style={{ margin: 0 }}>
          Thêm banner mới
        </Title>
      </div>

      <Divider />

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <Button
            type={uploadMode === "file" ? "primary" : "default"}
            icon={<CloudUploadOutlined />}
            onClick={() => setUploadMode("file")}
          >
            Tải ảnh từ máy tính
          </Button>
          <Button
            type={uploadMode === "url" ? "primary" : "default"}
            icon={<LinkOutlined />}
            onClick={() => setUploadMode("url")}
          >
            Sử dụng URL ảnh
          </Button>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ imageUrl: "" }}
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          <Col span={12}>
            <div className="upload-container bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
              <Spin spinning={loading} tip="Đang tải ảnh lên...">
                {!banner.imageUrl ? (
                  uploadMode === "file" ? (
                    <Dragger {...uploadProps} className="p-5">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined
                          style={{ fontSize: "48px", color: "#1890ff" }}
                        />
                      </p>
                      <p className="ant-upload-text">
                        Kéo thả hoặc nhấp vào đây để tải ảnh lên
                      </p>
                      <p className="ant-upload-hint">
                        Hỗ trợ các định dạng: JPG, PNG, GIF. Tối đa 10MB.
                      </p>
                    </Dragger>
                  ) : (
                    <div className="text-center">
                      <LinkOutlined
                        style={{ fontSize: "48px", color: "#1890ff" }}
                      />
                      <p className="mt-2">Nhập URL ảnh bên cạnh</p>
                    </div>
                  )
                ) : (
                  <div className="relative w-full">
                    <div className="aspect-[16/9] overflow-hidden rounded-md">
                      <img
                        src={banner.imageUrl}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button danger shape="circle" onClick={handleClearImage}>
                        ×
                      </Button>
                    </div>
                  </div>
                )}
              </Spin>
            </div>
          </Col>

          <Col span={12}>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-h-[300px]">
              <Form.Item
                label="URL Ảnh"
                name="imageUrl"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập URL ảnh hoặc tải ảnh lên",
                  },
                  {
                    type: "url",
                    message: "Vui lòng nhập đúng định dạng URL",
                  },
                ]}
              >
                <Input
                  value={banner.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Nhập URL ảnh"
                  className="w-full"
                  addonAfter={
                    uploadMode === "url" && banner.imageUrl && !loading ? (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => form.submit()}
                        style={{ margin: "-4px -8px", padding: "0 8px" }}
                      >
                        Sử dụng
                      </Button>
                    ) : null
                  }
                />
              </Form.Item>

              <div className="mt-4">
                <Text type="secondary" className="block mb-4">
                  Banner sẽ được hiển thị tại trang chủ của website. Khuyến nghị
                  sử dụng ảnh có tỷ lệ 16:9 và kích thước tối thiểu 1200x675
                  pixels.
                </Text>
              </div>

              <Form.Item className="mt-12">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={addBannerMutation.isPending}
                  className="w-full h-10"
                  disabled={!banner.imageUrl}
                >
                  Lưu Banner
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AdminBannerAdd;
