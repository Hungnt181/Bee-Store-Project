import React from "react";
import { Form, Input, Button, message, Flex } from "antd"; // Import các component từ Ant Design
import axios from "axios"; // Import axios để gọi API
import { useNavigate } from "react-router-dom"; // Hook để điều hướng trang
import { useMutation, useQuery } from "@tanstack/react-query"; // Import các hooks để quản lý truy vấn dữ liệu

// Định nghĩa interface cho dữ liệu màu sắc
interface ColorData {
  name: string; // Tên màu
  hexcode: string; // Mã màu (hex)
}

const AdminColorAdd: React.FC = () => {
  const navigate = useNavigate(); // Hook điều hướng trang

  // Fetch danh sách màu để kiểm tra trùng lặp trước khi thêm mới
  const { data: colors } = useQuery<ColorData[]>({
    queryKey: ["colors"], // Khóa truy vấn, dùng để quản lý caching
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/colors"); // Gọi API để lấy danh sách màu
      return res.data.data; // Trả về dữ liệu danh sách màu
    },
  });

  // Sử dụng useMutation để xử lý việc thêm màu mới vào API
  const { mutate } = useMutation({
    mutationFn: async (newColor: ColorData) => {
      const color = await axios.post(
        `http://localhost:3000/api/colors/`, // Gửi yêu cầu POST để thêm màu mới
        newColor
      );
      return color.data; // Trả về dữ liệu phản hồi từ API
    },
    onSuccess() {
      message.success("Thêm mới màu sắc thành công"); // Hiển thị thông báo thành công
      navigate("/admin/color"); // Điều hướng về trang danh sách màu
    },
    onError() {
      message.error("Thêm mới màu sắc thất bại!!"); // Hiển thị thông báo lỗi nếu thất bại
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
      <h2>THÊM MỚI MÀU SẮC</h2> {/* Tiêu đề của trang */}
      <Form
        onFinish={checkDuplicate} // Gọi hàm kiểm tra trùng lặp khi submit form
        layout="vertical" // Căn dọc các label của form
        style={{ width: "400px" }} // Định dạng kích thước form
      >
        {/* Input nhập tên màu */}
        <Form.Item
          label="Tên màu sắc"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]} // Bắt buộc nhập
        >
          <Input placeholder="Nhập tên màu" />
        </Form.Item>

        {/* Input nhập mã màu */}
        <Form.Item
          label="Mã màu sắc"
          name="hexcode"
          rules={[
            { required: true, message: "Vui lòng nhập mã màu sắc!" }, // Bắt buộc nhập
            {
              pattern: /^#[0-9A-Fa-f]{6}$/, // Ràng buộc định dạng mã màu hex
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
              onClick={() => navigate("/admin/color")} // Điều hướng về trang danh sách màu khi nhấn "Hủy bỏ"
              style={{ marginBottom: 20 }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit" // Kích hoạt onFinish của form khi bấm "Thêm mới"
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

export default AdminColorAdd; // Xuất component để sử dụng trong ứng dụng
