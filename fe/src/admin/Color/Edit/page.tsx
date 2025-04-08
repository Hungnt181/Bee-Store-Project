// import { useEffect, useState } from "react";
// import { Form, Input, Button, message, Skeleton, Flex } from "antd";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import { useMutation, useQuery } from "@tanstack/react-query";

// // Định nghĩa kiểu dữ liệu cho màu
// interface ColorData {
//   id?: string;
//   _id?: string;
//   name: string;
//   hexcode: string; // Mã màu (hex)
// }

// const AdminColorEdit = () => {
//   const { id } = useParams();
//   const [colorData, setColorData] = useState<ColorData | null>(null);
//   const navigate = useNavigate();

//   // Fetch danh sách tất cả các màu để kiểm tra trùng lặp
//   const { data: colors } = useQuery<ColorData[]>({
//     queryKey: ["colors"],
//     queryFn: async () => {
//       const res = await axios.get("http://localhost:3000/api/colors");
//       return res.data.data;
//     },
//   });

//   // Fetch dữ liệu màu cần chỉnh sửa
//   useEffect(() => {
//     const fetchColorData = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/colors/${id}`);
//         setColorData(res.data.data);
//       } catch {
//         message.error("Không thể lấy thông tin màu!");
//       }
//     };

//     if (id) {
//       fetchColorData();
//     }
//   }, [id]);

//   // Hàm cập nhật màu
//   const { mutate } = useMutation({
//     mutationFn: async (updateColor: ColorData) => {
//       const color = await axios.put(
//         `http://localhost:3000/api/colors/${id}`,
//         updateColor
//       );
//       return color.data;
//     },
//     onSuccess() {
//       message.success("Cập nhật màu sắc thành công");
//       navigate("/admin/color");
//     },
//     onError() {
//       message.error("Cập nhật màu sắc thất bại!!");
//     },
//   });

//   // Kiểm tra trùng lặp trước khi cập nhật
//   const checkDuplicate = (values: ColorData) => {
//     if (!colors) return;

//     const isNameDuplicate = colors.some(
//       (color) =>
//         (color.id || color._id) !== id &&
//         color.name.toLowerCase() === values.name.toLowerCase()
//     );

//     const isHexDuplicate = colors.some(
//       (color) =>
//         (color.id || color._id) !== id &&
//         color.hexcode.toLowerCase() === values.hexcode.toLowerCase()
//     );

//     if (isNameDuplicate && isHexDuplicate) {
//       message.error("Tên màu và mã màu đã tồn tại!");
//     } else if (isNameDuplicate) {
//       message.error("Tên màu đã tồn tại!");
//     } else if (isHexDuplicate) {
//       message.error("Mã màu đã tồn tại!");
//     } else {
//       mutate(values);
//     }
//   };

//   if (!colorData) {
//     return <Skeleton>Đang tải dữ liệu...</Skeleton>;
//   }

//   return (
//     <div>
//       <h2 className="text-3xl mb-5 font-semibold">CẬP NHẬT MÀU SẮC</h2>
//       <Form
//         initialValues={colorData}
//         onFinish={checkDuplicate}
//         layout="vertical"
//         style={{ width: "400px" }}
//       >
//         <Form.Item
//           label="Tên màu sắc"
//           name="name"
//           rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]}
//         >
//           <Input placeholder="Nhập tên màu" />
//         </Form.Item>

//         <Form.Item
//           label="Mã màu sắc"
//           name="hexcode"
//           rules={[
//             { required: true, message: "Vui lòng nhập mã màu sắc!" },
//             {
//               pattern: /^#[0-9A-Fa-f]{6}$/, // Kiểm tra định dạng mã màu hex (ví dụ: #FFFFFF)
//               message: "Mã màu không hợp lệ (ví dụ: #FFFFFF).",
//             },
//           ]}
//         >
//           <Input placeholder="Nhập mã màu" />
//         </Form.Item>

//         <Form.Item>
//           <Flex justify="right" gap={10}>
//             <Button
//               type="default"
//               onClick={() => navigate("/admin/color")}
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

// export default AdminColorEdit;
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
  Divider,
  ColorPicker,
} from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Định nghĩa kiểu dữ liệu cho màu
interface ColorData {
  id?: string;
  _id?: string;
  name: string;
  hexcode: string; // Mã màu (hex)
}

// Định nghĩa kiểu dữ liệu cho color picker
type ColorPickerValue = {
  toHexString: () => string;
};

const AdminColorEdit = () => {
  const { id } = useParams();
  const [colorData, setColorData] = useState<ColorData | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
        const res = await axios.get(`http://localhost:3000/api/colors/${id}`);
        setColorData(res.data.data);
        form.setFieldsValue(res.data.data);
        setIsLoading(false);
      } catch {
        message.error("Không thể lấy thông tin màu!");
        setIsLoading(false);
      }
    };

    if (id) {
      fetchColorData();
    }
  }, [id, form]);

  // Hàm cập nhật màu
  const { mutate, isPending } = useMutation({
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

  // Hàm xử lý khi người dùng thay đổi mã màu từ color picker
  const handleColorChange = (color: ColorPickerValue) => {
    form.setFieldsValue({ hexcode: color.toHexString().toUpperCase() });
  };

  if (isLoading) {
    return (
      <Card className="shadow-md" style={{ borderRadius: "8px" }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        bordered={false}
        className="shadow-md"
        style={{ borderRadius: "8px" }}
      >
        {/* Header with title and back button */}
        <Flex align="center" justify="center" className="mb-6">
          <Title level={3} style={{ margin: 0 }}>
            CẬP NHẬT MÀU SẮC
          </Title>
        </Flex>

        <Divider />

        <Form
          form={form}
          initialValues={colorData || undefined}
          onFinish={checkDuplicate}
          layout="vertical"
          style={{ maxWidth: "600px", margin: "0 auto" }}
          size="large"
        >
          <Form.Item
            label="Tên màu sắc"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên màu sắc!" }]}
          >
            <Input placeholder="Nhập tên màu (VD: Đỏ đậm, Xanh biển...)" />
          </Form.Item>

          <Form.Item
            label="Mã màu sắc"
            name="hexcode"
            rules={[
              { required: true, message: "Vui lòng nhập mã màu sắc!" },
              {
                pattern: /^#[0-9A-Fa-f]{6}$/,
                message: "Mã màu không hợp lệ (ví dụ: #FFFFFF).",
              },
            ]}
          >
            {/* <Input
              placeholder="Nhập mã màu (VD: #FF0000)"
              addonAfter={
                <ColorPicker
                  value={form.getFieldValue("hexcode")}
                  onChange={handleColorChange}
                  size="middle"
                />
              }
            /> */}
            <Input
              placeholder="Nhập mã màu (VD: #FF0000)"
              addonAfter={
                <ColorPicker
                  value={form.getFieldValue("hexcode")}
                  onChange={handleColorChange}
                  size="middle"
                />
              }
            />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Flex justify="end" gap={12}>
              <Button
                danger
                onClick={() => navigate("/admin/color")}
                size="large"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isPending}
                size="large"
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

export default AdminColorEdit;
