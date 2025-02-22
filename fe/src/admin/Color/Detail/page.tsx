import { useEffect, useState } from "react";
import { Button, Skeleton, message, Tag, Input, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

interface ColorData {
  name: string;
  hexcode: string;
  createdAt: string;
  updatedAt: string;
}

const AdminColorDetail = () => {
  const { id } = useParams(); // Lấy ID màu từ URL
  const [colorData, setColorData] = useState<ColorData | null>(null); // Dữ liệu màu sắc
  const navigate = useNavigate(); // Hook điều hướng trang

  // Lấy dữ liệu màu theo ID
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
      fetchColorData(); // Nếu có ID thì fetch dữ liệu
    }
  }, [id]);

  // Nếu chưa có dữ liệu, hiển thị loading
  if (!colorData) {
    return <Skeleton active />;
  }

  return (
    <article>
      <header>
        <h2>CHI TIẾT MÀU SẮC</h2>
      </header>

      <section className="color-details">
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
                  : "#fff", // Kiểm tra mã màu
              }}
            >
              {colorData.hexcode}
            </Tag>
          </Form.Item>

          <Form.Item label="Ngày tạo" name="createdAt">
            <Input
              value={dayjs(colorData.createdAt).format("DD/MM/YYYY")}
              style={{ color: "black", maxWidth: "300px" }} // Giới hạn chiều dài của trường
            />
          </Form.Item>

          <Form.Item label="Ngày sửa cuối" name="updatedAt">
            <Input
              value={dayjs(colorData.updatedAt).format("DD/MM/YYYY")}
              style={{ color: "black", maxWidth: "300px" }} // Giới hạn chiều dài của trường
            />
          </Form.Item>
        </Form>
      </section>

      <footer className="action-buttons">
        <Button
          type="primary"
          onClick={() => navigate(`/admin/color/edit/${id}`)} // Điều hướng đến trang chỉnh sửa
          style={{ marginRight: 10 }}
        >
          Chỉnh sửa
        </Button>
        <Button onClick={() => navigate("/admin/color")}>Hủy bỏ</Button>
      </footer>
    </article>
  );
};

export default AdminColorDetail;
