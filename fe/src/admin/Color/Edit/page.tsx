import { useEffect, useState } from "react";
import { Form, Input, Button, message, Skeleton, Flex } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// Định nghĩa kiểu dữ liệu cho màu
interface ColorData {
  name: string;
  hexcode: string;
}

const AdminColorEdit = () => {
  const { id } = useParams(); // Lấy ID màu từ URL
  const [colorData, setColorData] = useState<ColorData | null>(null); // Sử dụng kiểu dữ liệu ColorData
  const navigate = useNavigate(); // Hook điều hướng trang

  // Hàm gọi API để lấy dữ liệu màu dựa trên ID
  const { mutate } = useMutation({
    mutationFn: async (updateColor: ColorData) => {
      const color = await axios.put(
        `http://localhost:3000/api/colors/${id}`,
        updateColor
      );
      return color.data;
    },
    onSuccess() {
      message.success("Cập nhật màu sắc thành công");
      navigate("/admin/color");
    },
    onError() {
      message.error("Cập nhật màu sắc thất bại!!");
    },
  });
  useEffect(() => {
    const fetchColorData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/colors/${id}`);
        setColorData(res.data.data); // Lưu dữ liệu màu vào state
      } catch (err) {
        message.error("Không thể lấy thông tin màu!");
        throw new Error(`Opps!!! ${err}`);
      }
    };

    if (id) {
      fetchColorData(); // Nếu có ID, gọi hàm để lấy dữ liệu
    }
  }, [id]); // Hook sẽ chạy lại khi giá trị của ID thay đổi

  if (!colorData) {
    return <Skeleton>Đang tải dữ liệu...</Skeleton>;
  }

  return (
    <div>
      <h2>CẬP NHẬT MÀU SẮC</h2>
      <Form
        initialValues={colorData}
        onFinish={mutate}
        layout="vertical"
        style={{ width: "400px" }}
      >
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
              Cập nhật
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminColorEdit;
