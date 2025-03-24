import React from "react";
import {
  Form,
  Input,
  Button,
  message,
  Flex,
  Card,
  Typography,
  Divider,
  ColorPicker,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Định nghĩa interface cho dữ liệu màu sắc
interface ColorData {
  name: string;
  hexcode: string;
}

const AdminColorAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Fetch danh sách màu để kiểm tra trùng lặp trước khi thêm mới
  const { data: colors } = useQuery<ColorData[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/colors");
      return res.data.data;
    },
  });

  // Sử dụng useMutation để xử lý việc thêm màu mới vào API
  const { mutate, isPending } = useMutation({
    mutationFn: async (newColor: ColorData) => {
      const color = await axios.post(
        `http://localhost:3000/api/colors/`,
        newColor
      );
      return color.data;
    },
    onSuccess() {
      message.success("Thêm mới màu sắc thành công");
      navigate("/admin/color");
    },
    onError() {
      message.error("Thêm mới màu sắc thất bại!!");
    },
  });

  // Hàm kiểm tra trùng lặp trước khi gửi dữ liệu lên API
  const checkDuplicate = (values: ColorData) => {
    // Kiểm tra xem tên màu có bị trùng không
    const isNameDuplicate = colors?.some(
      (color) => color.name.toLowerCase() === values.name.toLowerCase()
    );

    // Kiểm tra xem mã màu có bị trùng không
    const isHexDuplicate = colors?.some(
      (color) => color.hexcode.toLowerCase() === values.hexcode.toLowerCase()
    );

    // Hiển thị thông báo lỗi nếu trùng lặp
    if (isNameDuplicate && isHexDuplicate) {
      message.error("Tên màu và mã màu đã tồn tại!");
    } else if (isNameDuplicate) {
      message.error("Tên màu đã tồn tại!");
    } else if (isHexDuplicate) {
      message.error("Mã màu đã tồn tại!");
    } else {
      mutate(values); // Nếu không trùng lặp, gọi hàm mutate để thêm màu mới
    }
  };

  // Hàm xử lý khi người dùng thay đổi mã màu từ color picker
  const handleColorChange = (color: { toHexString: () => string }) => {
    form.setFieldsValue({ hexcode: color.toHexString().toUpperCase() });
  };
  return (
    <div className="max-w-4xl mx-auto">
      <Card
        bordered={false}
        className="shadow-md"
        style={{ borderRadius: "8px" }}
      >
        {/* Header with title and back button */}
        <Flex align="center" justify="center" className="mb-6">
          <Title level={3} style={{ margin: 0 }}>
            THÊM MỚI MÀU SẮC
          </Title>
        </Flex>

        <Divider />

        {/* Main form */}
        <Form
          form={form}
          onFinish={checkDuplicate}
          layout="vertical"
          style={{ maxWidth: "600px", margin: "0 auto" }}
          size="large"
        >
          {/* Input nhập tên màu */}
          <Form.Item
            label="Tên màu sắc"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]}
          >
            <Input placeholder="Nhập tên màu (VD: Đỏ đậm, Xanh biển...)" />
          </Form.Item>

          {/* Input nhập mã màu với color picker */}
          <Form.Item
            label="Mã màu sắc"
            name="hexcode"
            rules={[
              { required: true, message: "Vui lòng nhập mã màu sắc!" },
              {
                pattern: /^#[0-9A-Fa-f]{6}$/,
                message: "Mã màu không hợp lệ (ví dụ: #FFFFFF).",
              },
            ]}
          >
            <Input
              placeholder="Nhập mã màu (VD: #FF0000)"
              addonAfter={
                <ColorPicker
                  value={form.getFieldValue("hexcode")}
                  onChange={handleColorChange}
                  size="middle"
                />
              }
            />
          </Form.Item>

          <Divider />

          {/* Các nút bấm: Hủy và Thêm mới */}
          <Form.Item>
            <Flex justify="end" gap={12}>
              <Button
                danger
                onClick={() => navigate("/admin/color")}
                size="large"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={isPending}
                size="large"
              >
                Thêm mới
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminColorAdd;
