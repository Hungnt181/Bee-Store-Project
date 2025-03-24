// import { useEffect, useState } from "react";
// import { Form, Input, Button, message, Skeleton, Flex } from "antd";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";

// // Định nghĩa kiểu dữ liệu cho kích thước
// interface SizeData {
//   name: string;
// }

// const AdminSizeEdit = () => {
//   const { id } = useParams(); // Lấy ID kích thước từ URL
//   const [sizeData, setSizeData] = useState<SizeData | null>(null);
//   const navigate = useNavigate();

//   // Hàm gọi API để cập nhật kích thước
//   const { mutate } = useMutation({
//     mutationFn: async (updateSize: SizeData) => {
//       const size = await axios.put(
//         `http://localhost:3000/api/sizes/${id}`,
//         updateSize
//       );
//       return size.data;
//     },
//     onSuccess() {
//       message.success("Cập nhật kích thước thành công");
//       navigate("/admin/size");
//     },
//     onError() {
//       message.error("Cập nhật kích thước thất bại!!");
//     },
//   });

//   useEffect(() => {
//     const fetchSizeData = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/sizes/${id}`);
//         setSizeData(res.data.data);
//       } catch (err) {
//         message.error("Không thể lấy thông tin kích thước!");
//         throw new Error(`Opps!!! ${err}`);
//       }
//     };

//     if (id) {
//       fetchSizeData();
//     }
//   }, [id]);

//   if (!sizeData) {
//     return <Skeleton>Đang tải dữ liệu...</Skeleton>;
//   }

//   return (
//     <div>
//       <h2 className="text-3xl mb-5 font-semibold">CẬP NHẬT KÍCH THƯỚC</h2>
//       <Form
//         initialValues={sizeData}
//         onFinish={mutate}
//         layout="vertical"
//         style={{ width: "400px" }}
//       >
//         <Form.Item
//           label="Tên kích thước"
//           name="name"
//           rules={[{ required: true, message: "Vui lòng nhập tên kích thước!" }]}
//         >
//           <Input placeholder="Nhập tên kích thước" />
//         </Form.Item>

//         <Form.Item>
//           <Flex justify="right" gap={10}>
//             <Button
//               type="default"
//               onClick={() => navigate("/admin/size")}
//               style={{ marginBottom: 20 }}
//             >
//               Hủy bỏ
//             </Button>
//             <Button
//               type="primary"
//               htmlType="submit"
//               style={{ marginRight: 10 }}
//             >
//               Cập nhật
//             </Button>
//           </Flex>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AdminSizeEdit;
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Skeleton,
  Flex,
  Card,
  Typography,
} from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Định nghĩa kiểu dữ liệu cho kích thước
interface SizeData {
  name: string;
}

const AdminSizeEdit = () => {
  const { id } = useParams(); // Lấy ID kích thước từ URL
  const [sizeData, setSizeData] = useState<SizeData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Hàm gọi API để cập nhật kích thước
  const { mutate, isPending } = useMutation({
    mutationFn: async (updateSize: SizeData) => {
      const size = await axios.put(
        `http://localhost:3000/api/sizes/${id}`,
        updateSize
      );
      return size.data;
    },
    onSuccess() {
      message.success("Cập nhật kích thước thành công");
      navigate("/admin/size");
    },
    onError() {
      message.error("Cập nhật kích thước thất bại!!");
    },
  });

  useEffect(() => {
    const fetchSizeData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/sizes/${id}`);
        setSizeData(res.data.data);
        form.setFieldsValue(res.data.data);
      } catch (err) {
        message.error("Không thể lấy thông tin kích thước!");
        console.error(`Error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSizeData();
    }
  }, [id, form]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card bordered={false} className="shadow-md">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card
        bordered={false}
        className="shadow-md"
        title={
          <Title level={3} className="m-0 text-center text-blue-700">
            CẬP NHẬT KÍCH THƯỚC
          </Title>
        }
      >
        <Form
          form={form}
          initialValues={sizeData || {}}
          onFinish={mutate}
          layout="vertical"
          className="max-w-md mx-auto"
        >
          <Form.Item
            label="Tên kích thước"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên kích thước!" },
              { min: 2, message: "Tên kích thước phải có ít nhất 2 ký tự!" },
              {
                max: 50,
                message: "Tên kích thước không được vượt quá 50 ký tự!",
              },
            ]}
          >
            <Input
              placeholder="Nhập tên kích thước"
              size="large"
              className="rounded"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="end" gap={10} className="mt-8">
              <Button
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={() => navigate("/admin/size")}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={isPending}
                className="bg-blue-600"
              >
                Cập nhật
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSizeEdit;
