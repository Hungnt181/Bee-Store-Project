import { useEffect, useState } from "react";
import { Button, Skeleton, message, Tag, Input, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

// Định nghĩa kiểu dữ liệu cho màu sắc
interface ColorData {
  name: string;
  hexcode: string;
  createdAt: string;
  updatedAt: string;
}

const AdminColorDetail = () => {
  const { id } = useParams();
  const [colorData, setColorData] = useState<ColorData | null>(null);
  const navigate = useNavigate();

  // Gọi API để lấy thông tin chi tiết của màu sắc theo ID
  useEffect(() => {
    const fetchColorData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/colors/${id}`);
        const detailData = res.data.data;
        setColorData({
          ...detailData,
          createdAt: dayjs(detailData.createdAt).format("DD/MM/YYYY HH:mm:ss"),
          updatedAt: dayjs(detailData.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
        });
      } catch {
        message.error("Không thể lấy thông tin màu!");
      }
    };

    if (id) {
      fetchColorData();
    }
  }, [id]);

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
                  : "#fff",
              }}
            >
              {colorData.hexcode}
            </Tag>
          </Form.Item>

          <Form.Item label="Ngày tạo" name="createdAt">
            <Input
              value={dayjs(colorData.createdAt).format("DD/MM/YYYY")}
              style={{ color: "black", maxWidth: "300px" }}
            />
          </Form.Item>

          <Form.Item label="Ngày sửa cuối" name="updatedAt">
            <Input
              value={dayjs(colorData.updatedAt).format("DD/MM/YYYY")}
              style={{ color: "black", maxWidth: "300px" }}
            />
          </Form.Item>
        </Form>
      </section>

      <footer className="action-buttons">
        {/* Nút chỉnh sửa, điều hướng đến trang chỉnh sửa màu */}
        <Button
          type="primary"
          onClick={() => navigate(`/admin/color/edit/${id}`)}
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
