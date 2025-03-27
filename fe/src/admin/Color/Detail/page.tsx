// import { useEffect, useState } from "react";
// import { Button, Skeleton, message, Tag, Input, Form } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import dayjs from "dayjs";

// // Định nghĩa kiểu dữ liệu cho màu sắc
// interface ColorData {
//   name: string;
//   hexcode: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const AdminColorDetail = () => {
//   const { id } = useParams();
//   const [colorData, setColorData] = useState<ColorData | null>(null);
//   const navigate = useNavigate();

//   // Gọi API để lấy thông tin chi tiết của màu sắc theo ID
//   useEffect(() => {
//     const fetchColorData = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/colors/${id}`);
//         const detailData = res.data.data;
//         setColorData({
//           ...detailData,
//           createdAt: dayjs(detailData.createdAt).format("DD/MM/YYYY HH:mm:ss"),
//           updatedAt: dayjs(detailData.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
//         });
//       } catch {
//         message.error("Không thể lấy thông tin màu!");
//       }
//     };

//     if (id) {
//       fetchColorData();
//     }
//   }, [id]);

//   // Nếu chưa có dữ liệu, hiển thị hiệu ứng tải
//   if (!colorData) {
//     return <Skeleton active />;
//   }

//   return (
//     <article>
//       <header>
//         <h2 className="text-3xl mb-5 font-semibold">CHI TIẾT MÀU SẮC</h2>
//       </header>

//       <section className="color-details">
//         {/* Form hiển thị thông tin chi tiết màu sắc */}
//         <Form layout="vertical" initialValues={colorData} disabled>
//           <Form.Item label="Tên màu" name="name">
//             <Input
//               value={colorData.name}
//               style={{ color: "black", maxWidth: "300px" }} // Giới hạn chiều dài của trường
//             />
//           </Form.Item>

//           <Form.Item label="Mã màu" name="hexcode">
//             <Tag
//               color={colorData.hexcode}
//               style={{
//                 color: /^#fffff[a-z0-9]/i.test(colorData.hexcode)
//                   ? "#000"
//                   : "#fff",
//               }}
//             >
//               {colorData.hexcode}
//             </Tag>
//           </Form.Item>

//           <Form.Item label="Ngày tạo" name="createdAt">
//             <Input
//               value={dayjs(colorData.createdAt).format("DD/MM/YYYY")}
//               style={{ color: "black", maxWidth: "300px" }}
//             />
//           </Form.Item>

//           <Form.Item label="Ngày sửa cuối" name="updatedAt">
//             <Input
//               value={dayjs(colorData.updatedAt).format("DD/MM/YYYY")}
//               style={{ color: "black", maxWidth: "300px" }}
//             />
//           </Form.Item>
//         </Form>
//       </section>

//       <footer className="action-buttons">
//         {/* Nút chỉnh sửa, điều hướng đến trang chỉnh sửa màu */}
//         <Button
//           type="primary"
//           onClick={() => navigate(`/admin/color/edit/${id}`)}
//           style={{ marginRight: 10 }}
//         >
//           Chỉnh sửa
//         </Button>

//         {/* Nút hủy bỏ, quay về danh sách màu */}
//         <Button onClick={() => navigate("/admin/color")}>Hủy bỏ</Button>
//       </footer>
//     </article>
//   );
// };

// export default AdminColorDetail;
import { useEffect, useState } from "react";
import {
  Button,
  Skeleton,
  message,
  Tag,
  Input,
  Card,
  Divider,
  Row,
  Col,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gọi API để lấy thông tin chi tiết của màu sắc theo ID
  useEffect(() => {
    const fetchColorData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/colors/${id}`);
        const detailData = res.data.data;
        setColorData({
          ...detailData,
          createdAt: dayjs(detailData.createdAt).format("DD/MM/YYYY HH:mm:ss"),
          updatedAt: dayjs(detailData.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
        });
      } catch {
        message.error("Không thể lấy thông tin màu sắc!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchColorData();
    }
  }, [id]);

  // Nếu chưa có dữ liệu, hiển thị hiệu ứng tải
  if (loading) {
    return (
      <Card className="shadow-md">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  return (
    <div className="color-detail-page">
      <Card
        className="shadow-md rounded-lg"
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="m-0">
              CHI TIẾT MÀU SẮC
            </Title>
            {/* <div
              className="color-preview"
              style={{
                height: 40,
                width: 40,
                backgroundColor: colorData?.hexcode,
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            ></div> */}
          </div>
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={24} md={12}>
            <Card
              className="h-full bg-gray-50"
              title="Thông tin cơ bản"
              bordered={false}
            >
              <div className="mb-6">
                <Text strong className="block text-gray-500 mb-1">
                  Tên màu:
                </Text>
                <Input
                  value={colorData?.name}
                  className="font-medium text-lg"
                  readOnly
                />
              </div>

              <div>
                <Text strong className="block text-gray-500 mb-1">
                  Mã màu:
                </Text>
                <div className="flex items-center space-x-3">
                  <Tag
                    color={colorData?.hexcode}
                    style={{
                      color: /^#fffff[a-z0-9]/i.test(colorData?.hexcode || "")
                        ? "#000"
                        : "#fff",
                      fontSize: "14px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                    }}
                  >
                    {colorData?.hexcode}
                  </Tag>
                  <Input
                    value={colorData?.hexcode}
                    className="max-w-32"
                    readOnly
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col span={24} md={12}>
            <Card
              className="h-full bg-gray-50"
              title="Thông tin hệ thống"
              bordered={false}
            >
              <div className="mb-6">
                <Text strong className="block text-gray-500 mb-1">
                  Ngày tạo:
                </Text>
                <Input
                  value={colorData?.createdAt}
                  className="font-medium"
                  readOnly
                />
              </div>

              <div>
                <Text strong className="block text-gray-500 mb-1">
                  Ngày cập nhật:
                </Text>
                <Input
                  value={colorData?.updatedAt}
                  className="font-medium"
                  readOnly
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div className="flex justify-between mt-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/color")}
            size="large"
          >
            Quay lại
          </Button>

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/color/edit/${id}`)}
            size="large"
          >
            Chỉnh sửa
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminColorDetail;
