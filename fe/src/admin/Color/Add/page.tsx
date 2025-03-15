import React from "react";
import { Form, Input, Button, message, Flex } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

// Định nghĩa interface cho dữ liệu màu sắc
interface ColorData {
  name: string;
  hexcode: string;
}

const AdminColorAdd: React.FC = () => {
  const navigate = useNavigate();

  // Fetch danh sách màu để kiểm tra trùng lặp trước khi thêm mới
  const { data: colors } = useQuery<ColorData[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/colors");
      return res.data.data;
    },
  });

  // Sử dụng useMutation để xử lý việc thêm màu mới vào API
  const { mutate } = useMutation({
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

  return (
    <div>
      <h2>THÊM MỚI MÀU SẮC</h2>
      <Form
        onFinish={checkDuplicate}
        layout="vertical"
        style={{ width: "400px" }}
      >
        {/* Input nhập tên màu */}
        <Form.Item
          label="Tên màu sắc"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]}
        >
          <Input placeholder="Nhập tên màu" />
        </Form.Item>

        {/* Input nhập mã màu */}
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
          <Input placeholder="Nhập mã màu" />
        </Form.Item>

        {/* Các nút bấm: Hủy và Thêm mới */}
        <Form.Item>
          <Flex justify="right" gap={10}>
            <Button
              type="default"
              onClick={() => navigate("/admin/color")}
              style={{ marginBottom: 20 }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 10 }}
            >
              Thêm mới
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminColorAdd;
