import { useEffect, useState } from "react"; // Import các hook của React
import { Form, Input, Button, message, Skeleton, Flex } from "antd"; // Import các thành phần UI từ Ant Design
import axios from "axios"; // Import axios để gọi API
import { useNavigate, useParams } from "react-router-dom"; // Import hook để điều hướng và lấy tham số URL
import { useMutation, useQuery } from "@tanstack/react-query"; // Import react-query để quản lý dữ liệu bất đồng bộ

// Định nghĩa kiểu dữ liệu cho màu
interface ColorData {
  id?: string; // Một số API có thể trả về `id`
  _id?: string; // Một số API khác có thể dùng `_id`
  name: string; // Tên màu
  hexcode: string; // Mã màu (hex)
}

const AdminColorEdit = () => {
  const { id } = useParams(); // Lấy ID của màu từ URL
  const [colorData, setColorData] = useState<ColorData | null>(null); // State lưu dữ liệu của màu đang chỉnh sửa
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Fetch danh sách tất cả các màu để kiểm tra trùng lặp
  const { data: colors } = useQuery<ColorData[]>({
    queryKey: ["colors"], // Key để react-query quản lý cache
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/colors"); // Gọi API lấy danh sách màu
      return res.data.data; // Trả về danh sách màu từ API
    },
  });

  // Fetch dữ liệu màu cần chỉnh sửa
  useEffect(() => {
    const fetchColorData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/colors/${id}`); // Gọi API lấy dữ liệu màu theo ID
        setColorData(res.data.data); // Lưu dữ liệu vào state
      } catch {
        message.error("Không thể lấy thông tin màu!"); // Hiển thị thông báo lỗi nếu API thất bại
      }
    };

    if (id) {
      fetchColorData(); // Gọi hàm fetch nếu có ID
    }
  }, [id]);

  // Hàm cập nhật màu
  const { mutate } = useMutation({
    mutationFn: async (updateColor: ColorData) => {
      const color = await axios.put(
        `http://localhost:3000/api/colors/${id}`,
        updateColor // Gửi dữ liệu màu đã chỉnh sửa lên server
      );
      return color.data; // Trả về dữ liệu phản hồi từ API
    },
    onSuccess() {
      message.success("Cập nhật màu sắc thành công"); // Hiển thị thông báo thành công
      navigate("/admin/color"); // Chuyển hướng về trang danh sách màu
    },
    onError() {
      message.error("Cập nhật màu sắc thất bại!!"); // Hiển thị thông báo lỗi
    },
  });

  // Kiểm tra trùng lặp trước khi cập nhật
  const checkDuplicate = (values: ColorData) => {
    if (!colors) return;

    const isNameDuplicate = colors.some(
      (color) =>
        (color.id || color._id) !== id && // Bỏ qua chính màu đang chỉnh sửa
        color.name.toLowerCase() === values.name.toLowerCase()
    );

    const isHexDuplicate = colors.some(
      (color) =>
        (color.id || color._id) !== id &&
        color.hexcode.toLowerCase() === values.hexcode.toLowerCase()
    );

    if (isNameDuplicate && isHexDuplicate) {
      message.error("Tên màu và mã màu đã tồn tại!"); // Báo lỗi nếu cả tên và mã màu đều bị trùng
    } else if (isNameDuplicate) {
      message.error("Tên màu đã tồn tại!"); // Báo lỗi nếu chỉ trùng tên
    } else if (isHexDuplicate) {
      message.error("Mã màu đã tồn tại!"); // Báo lỗi nếu chỉ trùng mã màu
    } else {
      mutate(values); // Nếu không trùng, tiến hành cập nhật
    }
  };

  if (!colorData) {
    return <Skeleton>Đang tải dữ liệu...</Skeleton>; // Hiển thị loading nếu chưa có dữ liệu
  }

  return (
    <div>
      <h2>CẬP NHẬT MÀU SẮC</h2>
      <Form
        initialValues={colorData} // Set giá trị ban đầu từ dữ liệu màu
        onFinish={checkDuplicate} // Gọi hàm kiểm tra trùng lặp khi submit
        layout="vertical"
        style={{ width: "400px" }} // Định dạng form
      >
        <Form.Item
          label="Tên màu sắc"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]} // Bắt buộc nhập tên màu
        >
          <Input placeholder="Nhập tên màu" />
        </Form.Item>

        <Form.Item
          label="Mã màu sắc"
          name="hexcode"
          rules={[
            { required: true, message: "Vui lòng nhập mã màu sắc!" }, // Bắt buộc nhập mã màu
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
              onClick={() => navigate("/admin/color")} // Quay về trang danh sách màu nếu hủy
              style={{ marginBottom: 20 }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit" // Submit form khi nhấn "Cập nhật"
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

export default AdminColorEdit; // Xuất component để sử dụng ở nơi khác
