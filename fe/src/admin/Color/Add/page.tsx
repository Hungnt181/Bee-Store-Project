import React from "react";
import { Form, Input, Button, message, Flex } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

interface ColorData {
  name: string;
  hexcode: string;
}

const AdminColorAdd: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Xử lý khi người dùng gửi form
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

  return (
    <div>
      <h2>THÊM MỚI MÀU SẮC</h2>
      <Form onFinish={mutate} layout="vertical" style={{ width: "400px" }}>
        <Form.Item
          label="Tên màu sắc"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]}
        >
          <Input placeholder="Nhập tên màu" />
        </Form.Item>

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
