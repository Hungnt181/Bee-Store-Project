import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  message,
  Button,
  Popconfirm,
  Dropdown,
  TableProps,
  MenuProps,
  Tooltip,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Size from "../../interface/Size";
import dayjs from "dayjs";

const AdminSizeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: sizes,
    error,
    isLoading,
  } = useQuery<Size[]>({
    queryKey: ["sizes"],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/sizes");
        return res.data.data.map((size: Size) => ({
          key: size._id.toString(), // Ensure _id is a string
          ...size,
        }));
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        message.error("Lỗi khi lấy danh sách kích thước!");
        return [];
      }
    },
  });

  useEffect(() => {
    if (error instanceof Error) {
      message.error(`Lỗi khi tải danh sách kích thước! ${error.message}`);
    }
  }, [error]);

  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!sizes || sizes.length === 0) {
    return <p>Không có kích thước nào để hiển thị.</p>;
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/sizes/${id}`);
      message.success("Xóa kích thước thành công!");
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    } catch (err) {
      message.error("Lỗi khi xóa kích thước.");
      console.error(err);
    }
  };

  const columns: TableProps<Size>["columns"] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 80,
      render: (_: string, __: Size, index: number) => index + 1,
    },
    {
      title: "Tên kích thước",
      dataIndex: "name",
      key: "name",
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
      render: (_: unknown, size: Size) => {
        const items: MenuProps["items"] = [
          {
            key: "UPDATE",
            label: (
              <a onClick={() => navigate(`/admin/size/edit/${size._id}`)}>
                Chỉnh sửa
              </a>
            ),
          },
          {
            key: "DELETE",
            label: (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa kích thước này?"
                onConfirm={() => handleDelete(size._id.toString())} // Ensure _id is a string
                okText="Có"
                cancelText="Không"
                onCancel={() => message.error("Xóa bị hủy")}
                placement="topLeft"
              >
                <a>Xóa</a>
              </Popconfirm>
            ),
          },
        ];
        return (
          <>
            <Button
              onClick={() => navigate(`/admin/size/detail/${size._id}`)}
              type="primary"
            >
              Chi tiết
            </Button>
            <Dropdown menu={{ items }}>
              <Button type="text" icon={<MoreOutlined />} style={{ marginLeft: 8 }} />
            </Dropdown>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <h2>DANH SÁCH KÍCH THƯỚC</h2>
      <Button
        type="primary"
        onClick={() => navigate("/admin/size/add")}
        style={{ marginBottom: 10 }}
      >
        Thêm kích thước
      </Button>
      <Table<Size>
        dataSource={sizes}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="_id"
        scroll={{ y: 55 * 7 }}
      />
    </div>
  );
};

export default AdminSizeList;
