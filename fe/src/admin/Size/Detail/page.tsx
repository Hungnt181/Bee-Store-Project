import { useEffect, useState } from "react";
import { Button, Skeleton, message, Input, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

interface SizeData {
  name: string;
  createdAt: string;
  updatedAt: string;
}

const AdminSizeDetail = () => {
  const { id } = useParams();
  const [sizeData, setSizeData] = useState<SizeData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSizeData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/sizes/${id}`);
        setSizeData(res.data.data);
      } catch {
        message.error("Không thể lấy thông tin kích thước!");
      }
    };

    if (id) {
      fetchSizeData();
    }
  }, [id]);

  if (!sizeData) {
    return <Skeleton active />;
  }

  return (
    <article>
      <header>
        <h2>CHI TIẾT KÍCH THƯỚC</h2>
      </header>

      <section className="size-details">
        <Form
          layout="vertical"
          initialValues={{
            name: sizeData.name,
            createdAt: dayjs(sizeData.createdAt),
            updatedAt: dayjs(sizeData.updatedAt),
          }}
        >
          <Form.Item label="Tên kích thước" name="name">
            <Input disabled value={sizeData.name} style={{ color: "black", maxWidth: "300px" }} />
          </Form.Item>

          <Form.Item label="Ngày tạo" name="createdAt">
            <Input
              disabled
              value={dayjs(sizeData.createdAt).format("DD/MM/YYYY")}
              style={{ color: "black", maxWidth: "300px" }}
            />
          </Form.Item>

          <Form.Item label="Ngày sửa cuối" name="updatedAt">
            <Input
              disabled
              value={dayjs(sizeData.updatedAt).format("DD/MM/YYYY")}
              style={{ color: "black", maxWidth: "300px" }}
            />
          </Form.Item>
        </Form>
      </section>

      <footer className="action-buttons">
        <Button
          type="primary"
          onClick={() => navigate(`/admin/size/edit/${id}`)}
          style={{ marginRight: 10 }}
        >
          Sửa
        </Button>
        <Button onClick={() => navigate("/admin/size")}>Hủy bỏ</Button>
      </footer>
    </article>
  );
};

export default AdminSizeDetail;
