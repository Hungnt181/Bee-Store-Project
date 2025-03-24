// import React from "react";
// import { Form, Input, Button, message, Flex } from "antd";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";

// interface SizeData {
//   name: string;
// }

// const AdminSizeAdd: React.FC = () => {
//   const navigate = useNavigate();

//   // Xử lý khi người dùng gửi form
//   const { mutate } = useMutation({
//     mutationFn: async (newSize: SizeData) => {
//       const size = await axios.post(
//         `http://localhost:3000/api/sizes/`,
//         newSize
//       );
//       return size.data;
//     },
//     onSuccess() {
//       message.success("Thêm mới kích thước thành công");
//       navigate("/admin/size");
//     },
//     onError() {
//       message.error("Thêm mới kích thước thất bại!!");
//     },
//   });

//   return (
//     <div>
//       <h2 className="text-3xl mb-5 font-semibold">THÊM MỚI KÍCH THƯỚC</h2>
//       <Form onFinish={mutate} layout="vertical" style={{ width: "400px" }}>
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
//               Thêm mới
//             </Button>
//           </Flex>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AdminSizeAdd;
import React from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const { Title } = Typography;

interface SizeData {
  name: string;
}

const AdminSizeAdd: React.FC = () => {
  const navigate = useNavigate();

  // Handle form submission
  const { mutate, isPending } = useMutation({
    mutationFn: async (newSize: SizeData) => {
      const size = await axios.post(
        `http://localhost:3000/api/sizes/`,
        newSize
      );
      return size.data;
    },
    onSuccess() {
      message.success("Thêm mới kích thước thành công");
      navigate("/admin/size");
    },
    onError() {
      message.error("Thêm mới kích thước thất bại!!");
    },
  });

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card
        bordered={false}
        className="shadow-md"
        title={
          <Title level={3} className="m-0 text-center text-blue-700">
            THÊM MỚI KÍCH THƯỚC
          </Title>
        }
      >
        <Form
          onFinish={mutate}
          layout="vertical"
          className="max-w-md mx-auto"
          requiredMark={false}
        >
          <Form.Item
            label={<span className="font-medium">Tên kích thước</span>}
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên kích thước!" },
            ]}
          >
            <Input
              placeholder="Nhập tên kích thước"
              className="rounded-md"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mt-8">
            <Space className="w-full justify-end">
              <Button
                size="large"
                onClick={() => navigate("/admin/size")}
                className="min-w-24"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                size="large"
                className="min-w-24 bg-blue-600"
              >
                Thêm mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSizeAdd;
