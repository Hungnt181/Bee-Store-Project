import { useEffect, useState } from "react";
import { Form, Input, Button, message, Skeleton, Flex } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

// Định nghĩa kiểu dữ liệu cho màu
interface ColorData {
  id?: string;
  _id?: string;
  name: string;
  hexcode: string; // Mã màu (hex)
}

const AdminColorEdit = () => {
  const { id } = useParams();
  const [colorData, setColorData] = useState<ColorData | null>(null);
  const navigate = useNavigate();

  // Fetch danh sách tất cả các màu để kiểm tra trùng lặp
  const { data: colors } = useQuery<ColorData[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/colors");
      return res.data.data;
    },
  });

  // Fetch dữ liệu màu cần chỉnh sửa
  useEffect(() => {
    const fetchColorData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/colors/${id}`);
        setColorData(res.data.data);
      } catch {
        message.error("Không thể lấy thông tin màu!");
      }
    };

    if (id) {
      fetchColorData();
    }
  }, [id]);

  // Hàm cập nhật màu
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

  // Kiểm tra trùng lặp trước khi cập nhật
  const checkDuplicate = (values: ColorData) => {
    if (!colors) return;

    const isNameDuplicate = colors.some(
      (color) =>
        (color.id || color._id) !== id &&
        color.name.toLowerCase() === values.name.toLowerCase()
    );

    const isHexDuplicate = colors.some(
      (color) =>
        (color.id || color._id) !== id &&
        color.hexcode.toLowerCase() === values.hexcode.toLowerCase()
    );

    if (isNameDuplicate && isHexDuplicate) {
      message.error("Tên màu và mã màu đã tồn tại!");
    } else if (isNameDuplicate) {
      message.error("Tên màu đã tồn tại!");
    } else if (isHexDuplicate) {
      message.error("Mã màu đã tồn tại!");
    } else {
      mutate(values);
    }
  };

  if (!colorData) {
    return <Skeleton>Đang tải dữ liệu...</Skeleton>;
  }

  return (
    <div>
      <h2>CẬP NHẬT MÀU SẮC</h2>
      <Form
        initialValues={colorData}
        onFinish={checkDuplicate}
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
              pattern: /^#[0-9A-Fa-f]{6}$/, // Kiểm tra định dạng mã màu hex (ví dụ: #FFFFFF)
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
