import { useEffect, useState } from "react"; // Import useEffect và useState để quản lý trạng thái và hiệu ứng
import { Button, Skeleton, message, Tag, Input, Form } from "antd"; // Import các thành phần UI từ Ant Design
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate và useParams để điều hướng và lấy tham số từ URL
import axios from "axios"; // Import axios để gọi API
import dayjs from "dayjs"; // Import dayjs để xử lý thời gian

// Định nghĩa kiểu dữ liệu cho màu sắc
interface ColorData {
  name: string;
  hexcode: string;
  createdAt: string;
  updatedAt: string;
}

const AdminColorDetail = () => {
  const { id } = useParams(); // Lấy ID của màu từ URL
  const [colorData, setColorData] = useState<ColorData | null>(null); // State lưu dữ liệu chi tiết màu sắc
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Gọi API để lấy thông tin chi tiết của màu sắc theo ID
  useEffect(() => {
    const fetchColorData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/colors/${id}`); // Gửi request GET để lấy chi tiết màu sắc
        const detailData = res.data.data;
        setColorData({
          ...detailData,
          createdAt: dayjs(detailData.createdAt).format("DD/MM/YYYY HH:mm:ss"), // Định dạng lại ngày tạo
          updatedAt: dayjs(detailData.updatedAt).format("DD/MM/YYYY HH:mm:ss"), // Định dạng lại ngày cập nhật
        });
      } catch {
        message.error("Không thể lấy thông tin màu!"); // Hiển thị thông báo lỗi nếu API bị lỗi
      }
    };

    if (id) {
      fetchColorData(); // Nếu có ID thì gọi API
    }
  }, [id]); // Chạy lại useEffect nếu ID thay đổi

  // Nếu chưa có dữ liệu, hiển thị hiệu ứng tải
  if (!colorData) {
    return <Skeleton active />;
  }

  return (
    <article>
      <header>
        <h2>CHI TIẾT MÀU SẮC</h2>
      </header>

      <section className="color-details">
        {/* Form hiển thị thông tin chi tiết màu sắc */}
        <Form layout="vertical" initialValues={colorData} disabled>
          <Form.Item label="Tên màu" name="name">
            <Input
              value={colorData.name}
              style={{ color: "black", maxWidth: "300px" }} // Giới hạn chiều dài của trường
            />
          </Form.Item>

          <Form.Item label="Mã màu" name="hexcode">
            <Tag
              color={colorData.hexcode}
              style={{
                color: /^#fffff[a-z0-9]/i.test(colorData.hexcode)
                  ? "#000"
                  : "#fff", // Kiểm tra mã màu và chọn màu chữ phù hợp
              }}
            >
              {colorData.hexcode}
            </Tag>
          </Form.Item>

          <Form.Item label="Ngày tạo" name="createdAt">
            <Input
              value={dayjs(colorData.createdAt).format("DD/MM/YYYY")} // Hiển thị ngày tạo với định dạng ngắn gọn
              style={{ color: "black", maxWidth: "300px" }} // Giới hạn chiều dài của trường
            />
          </Form.Item>

          <Form.Item label="Ngày sửa cuối" name="updatedAt">
            <Input
              value={dayjs(colorData.updatedAt).format("DD/MM/YYYY")} // Hiển thị ngày cập nhật cuối cùng
              style={{ color: "black", maxWidth: "300px" }} // Giới hạn chiều dài của trường
            />
          </Form.Item>
        </Form>
      </section>

      <footer className="action-buttons">
        {/* Nút chỉnh sửa, điều hướng đến trang chỉnh sửa màu */}
        <Button
          type="primary"
          onClick={() => navigate(`/admin/color/edit/${id}`)} // Điều hướng đến trang chỉnh sửa
          style={{ marginRight: 10 }}
        >
          Chỉnh sửa
        </Button>

        {/* Nút hủy bỏ, quay về danh sách màu */}
        <Button onClick={() => navigate("/admin/color")}>Hủy bỏ</Button>
      </footer>
    </article>
  );
};

export default AdminColorDetail;
