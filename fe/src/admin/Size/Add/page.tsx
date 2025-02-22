import React from "react";
import { Form, Input, Button, message, Flex } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

interface SizeData {
  name: string;
}

const AdminSizeAdd: React.FC = () => {
  const navigate = useNavigate();

  // Xử lý khi người dùng gửi form
  const { mutate } = useMutation({
    mutationFn: async (newSize: SizeData) => {
      const size = await axios.post(
        `http://localhost:3000/api/sizes/`,
        newSize
      );
      return size.data;
    },
    onSuccess() {
      message.success("Thêm mới kích thước thành công");
      navigate("/admin/size");
    },
    onError() {
      message.error("Thêm mới kích thước thất bại!!");
    },
  });

  return (
    <div>
      <h2>THÊM MỚI KÍCH THƯỚC</h2>
      <Form onFinish={mutate} layout="vertical" style={{ width: "400px" }}>
        <Form.Item
          label="Tên kích thước"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên kích thước!" }]}
        >
          <Input placeholder="Nhập tên kích thước" />
        </Form.Item>

        <Form.Item>
          <Flex justify="right" gap={10}>
            <Button
              type="default"
              onClick={() => navigate("/admin/size")}
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

export default AdminSizeAdd;
