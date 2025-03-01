import { useQuery } from "@tanstack/react-query"; // Import useQuery từ react-query để quản lý truy vấn dữ liệu
import {
  Table,
  Tag,
  message,
  Button,
  Dropdown,
  TableProps,
  MenuProps,
  Tooltip,
  notification,
  Form,
  Input,
  Flex,
} from "antd"; // Import các thành phần UI từ Ant Design
import { MoreOutlined, PlusOutlined } from "@ant-design/icons"; // Import biểu tượng từ Ant Design
import axios from "axios"; // Import axios để gọi API
import { useEffect, useState } from "react"; // Import useEffect và useState để quản lý trạng thái và hiệu ứng
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng trang
import Color from "../../interface/Color"; // Import interface Color để sử dụng kiểu dữ liệu
import dayjs from "dayjs"; // Import dayjs để xử lý thời gian

const AdminColorList = () => {
  const navigate = useNavigate(); // Hook dùng để điều hướng
  const [searchText, setSearchText] = useState(""); // State để lưu giá trị tìm kiếm

  // Gọi API để lấy danh sách màu sắc sử dụng react-query
  const {
    data: colors,
    error,
    isLoading,
  } = useQuery<Color[]>({
    queryKey: ["colors"], // Khóa truy vấn, giúp react-query biết khi nào cần refetch
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/colors"); // Gửi request GET để lấy danh sách màu
        return res.data.data.map((color: Color) => ({
          key: color._id, // Thêm key cho mỗi mục để sử dụng trong bảng
          ...color,
        }));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data); // Hiển thị lỗi nếu có
        } else {
          notification.error({
            message: "Chỉnh sửa màu sắc thất bại",
            placement: "topRight",
          });
        }
      }
    },
  });

  // Xử lý hiển thị thông báo lỗi khi có lỗi xảy ra
  useEffect(() => {
    if (error instanceof Error) {
      message.error(`Lỗi khi tải danh sách màu! ${error.message}`);
    }
  }, [error]);

  // Kiểm tra trạng thái loading
  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  // Kiểm tra nếu danh sách màu rỗng
  if (!colors || colors.length === 0) {
    return <p>Không có màu nào để hiển thị.</p>;
  }

  // Lọc danh sách màu theo từ khóa tìm kiếm
  const filteredColors = colors.filter(
    (color) =>
      color.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      (color.hexcode &&
        color.hexcode.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Định nghĩa các cột của bảng
  const columns: TableProps<Color>["columns"] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 100,
      render: (_: string, __: Color, index: number) => index + 1, // Hiển thị số thứ tự
    },
    {
      title: "Tên màu",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (value: string) => <Tooltip title={value}>{value}</Tooltip>, // Hiển thị tên màu với tooltip
    },
    {
      title: "Mã màu (hexcode)",
      dataIndex: "hexcode",
      key: "hexcode",
      width: 220,
      render: (hexcode: string) => {
        const textColor = /^#fffff[a-z0-9]/i.test(hexcode) ? "#000" : "#fff"; // Xác định màu chữ phù hợp
        return (
          <Tag
            color={hexcode}
            style={{ color: textColor, fontWeight: "normal" }}
          >
            {hexcode}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      render: (value: string) => (
        <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      ), // Hiển thị ngày tạo với tooltip chi tiết
    },
    {
      title: "Ngày sửa cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 220,
      render: (value: string) => (
        <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      ), // Hiển thị ngày cập nhật cuối cùng
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right", // Cố định cột ở bên phải
      render: (_: unknown, color: Color) => {
        const items: MenuProps["items"] = [
          {
            key: "UPDATE",
            label: (
              <a onClick={() => navigate(`/admin/color/edit/${color._id}`)}>
                Chỉnh sửa
              </a>
            ), // Điều hướng đến trang chỉnh sửa màu
          },
          {
            key: "DELETE",
            label: <a>Xóa</a>,
            disabled: true, // Chức năng xóa đang bị vô hiệu hóa
          },
        ];
        return (
          <>
            <Button
              onClick={() => navigate(`/admin/color/detail/${color._id}`)}
              type="primary"
            >
              Chi tiết
            </Button>
            <Dropdown menu={{ items }}>
              <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ marginLeft: 8 }}
              />
            </Dropdown>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-3xl mb-5 font-semibold">DANH SÁCH MÀU SẮC</h1>
      {/* Ô tìm kiếm */}
      <Flex gap={0} justify="space-between">
        <Form style={{ marginBottom: 10 }}>
          <Form.Item style={{ width: "400px" }}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã màu"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Form.Item>
        </Form>

        {/* Nút thêm màu sắc */}
        <Button
          type="primary"
          onClick={() => navigate("/admin/color/add")}
          style={{ marginBottom: 10 }}
          icon={<PlusOutlined />}
        >
          Thêm mới
        </Button>
      </Flex>
      {/* Bảng hiển thị danh sách màu */}
      <Table<Color>
        dataSource={filteredColors} // Dữ liệu nguồn cho bảng
        columns={columns} // Cấu trúc cột
        pagination={{ pageSize: 10 }} // Phân trang, mỗi trang hiển thị 10 dòng
        rowKey="_id" // Định danh duy nhất cho mỗi dòng
        scroll={{ y: 55 * 7 }} // Kích thước cuộn của bảng
      />
    </div>
  );
};

export default AdminColorList;
