import React from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const { Title } = Typography;

interface SizeData {
  name: string;
}

const AdminSizeAdd: React.FC = () => {
  const navigate = useNavigate();

  // Handle form submission
  const { mutate, isPending } = useMutation({
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
    <div className="max-w-3xl mx-auto py-8">
      <Card
        bordered={false}
        className="shadow-md"
        title={
          <Title level={3} className="m-0 text-center text-blue-700">
            THÊM MỚI KÍCH THƯỚC
          </Title>
        }
      >
        <Form
          onFinish={mutate}
          layout="vertical"
          className="max-w-md mx-auto "
          requiredMark={false}
        >
          <Form.Item
            label={<span className="font-medium ">Tên kích thước</span>}
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên kích thước!" },
            ]}
          >
            <Input
              placeholder="Nhập tên kích thước"
              className="rounded-md"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mt-8">
            <Space className="w-full justify-end">
              <Button
                size="large"
                onClick={() => navigate("/admin/size")}
                className="min-w-24"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                size="large"
                className="min-w-24 bg-blue-600"
              >
                Thêm mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSizeAdd;
