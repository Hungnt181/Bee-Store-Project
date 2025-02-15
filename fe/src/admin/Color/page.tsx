import { useQuery } from "@tanstack/react-query";
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
} from "antd";
import { MoreOutlined } from "@ant-design/icons"; // Thêm icon Ellipsis
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import hook điều hướng
import Color from "../../interface/Color";
import dayjs from "dayjs";

const AdminColorList = () => {
  const navigate = useNavigate(); // Hook điều hướng trang
  // Để làm mới dữ liệu sau khi xóa

  // Truy vấn dữ liệu từ API
  const {
    data: colors,
    error,
    isLoading,
  } = useQuery<Color[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/colors");
        console.log(res.data.data); // Kiểm tra dữ liệu trả về
        return res.data.data.map((color: Color) => ({
          key: color._id, // Đảm bảo bạn có trường _id trong Color
          ...color,
        })); // Đảm bảo trả về mảng
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data);
        } else {
          notification.error({
            message: "Chỉnh sửa màu sắc thất bại",
            placement: "topRight",
          });
        }
      }
    },
  });

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (error instanceof Error) {
      message.error(`Lỗi khi tải danh sách màu! ${error.message}`);
    }
  }, [error]);

  // Hiển thị loading khi dữ liệu chưa tải xong
  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  // Hiển thị thông báo nếu không có dữ liệu
  if (!colors || colors.length === 0) {
    return <p>Không có màu nào để hiển thị.</p>;
  }

  // Handle delete color

  // Cột cho bảng màu
  const columns: TableProps<Color>["columns"] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 80,
      render: (_: string, __: Color, index: number) => index + 1, // Hiển thị số thứ tự dựa trên index
    },
    {
      title: "Tên màu",
      dataIndex: "name",
      key: "name",
      render: (value: string) => {
        return <Tooltip title={value}>{value}</Tooltip>;
      },
    },
    {
      title: "Mã màu (hexcode)",
      dataIndex: "hexcode",
      key: "hexcode",
      render: (hexcode: string) => {
        // Kiểm tra nếu mã màu bắt đầu bằng #fffff (theo sau là bất kỳ ký tự nào)
        const textColor = /^#fffff[a-z0-9]/i.test(hexcode) ? "#000" : "#fff";
        return (
          <Tag color={hexcode} style={{ color: textColor, fontWeight: "bold" }}>
            {hexcode}
          </Tag>
        );
      },
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => (
        <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày sửa cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string) => (
        <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      align: "left",
      render: (_: unknown, color: Color) => {
        const items: MenuProps["items"] = [
          {
            key: "UPDATE",
            label: (
              <a onClick={() => navigate(`/admin/color/edit/${color._id}`)}>
                Chỉnh sửa
              </a>
            ),
          },
          {
            key: "DELETE",
            label: <a>Xóa</a>,
            disabled: true,
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
      <h2>DANH SÁCH MÀU SẮC</h2>
      {/* Nút thêm màu */}
      <Button
        type="primary"
        onClick={() => navigate("/admin/color/add")} // Điều hướng đến trang thêm màu
        style={{
          marginBottom: 10,
        }}
      >
        Thêm màu sắc
      </Button>

      <Table<Color>
        dataSource={colors} // Dữ liệu màu
        columns={columns} // Cột của bảng
        pagination={{ pageSize: 10 }} // Tắt phân trang nếu không cần
        rowKey="_id" // Chỉ định trường làm khóa cho mỗi hàng
        scroll={{ y: 55 * 7 }}
      />
    </div>
  );
};

export default AdminColorList;
