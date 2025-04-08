import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  message,
  Switch,
  Button,
  Popconfirm,
  Tag,
  Image,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

// Định nghĩa kiểu dữ liệu cho Banner
interface Banner {
  _id: string;
  imageUrl: string;
  createdAt: string;
  status: boolean;
  uploadedAt?: string;
}

const AdminBannerList = () => {
  const [searchText] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch danh sách banner
  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/banners");
      return res.data.data; // Đúng với format API trả về
    },
  });

  // Mutation toggle trạng thái banner
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.patch(
        `http://localhost:3000/api/banners/${id}/toggle-status`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      message.success("Trạng thái banner đã được cập nhật!");
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại!");
    },
  });

  // Mutation xóa banner (optimized with isolated loading state)
  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/api/banners/${id}`);
      return id; // Return the ID so we can use it in onSuccess
    },
    onSuccess: (deletedId) => {
      // Update the cache directly instead of refetching all data
      queryClient.setQueryData(["banners"], (oldData: Banner[] | undefined) => {
        if (!oldData) return [];
        // Filter out the deleted banner from the cache
        return oldData.filter((banner) => banner._id !== deletedId);
      });

      message.success("Xóa banner thành công!");
    },
    onError: () => {
      message.error("Không thể xóa banner!");
    },
  });
  // Track which banner is being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Function to handle delete
  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteBannerMutation.mutate(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };
  // Kiểm tra xem URL ảnh là local hay remote
  const isLocalImage = (url: string) => url.startsWith("/uploads/");

  const filteredBanners = banners.filter((banner) =>
    banner.imageUrl.toLowerCase().includes(searchText.toLowerCase())
  );

  // Cấu hình cột cho bảng
  const columns: ColumnsType<Banner> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 70,
      align: "center",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 150,
      render: (url: string) => (
        <Image
          src={isLocalImage(url) ? `http://localhost:3000${url}` : url}
          alt="banner"
          height={80}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="data:image/png;base64,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"
          preview={{
            src: isLocalImage(url) ? `http://localhost:3000${url}` : url,
            mask: <EyeOutlined />,
          }}
        />
      ),
    },
    {
      title: "URL",
      dataIndex: "imageUrl",
      key: "imageUrl_text",
      ellipsis: true,
      width: 250,
      render: (url: string) => (
        <Tooltip title={url}>
          <span>{url}</span>
        </Tooltip>
      ),
    },
    {
      title: "Loại",
      key: "type",
      width: 120,
      render: (_, record: Banner) => (
        <Tag color={isLocalImage(record.imageUrl) ? "green" : "blue"}>
          {isLocalImage(record.imageUrl) ? "Upload" : "URL"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: boolean, record: Banner) => (
        <Switch
          checked={status}
          onChange={() => toggleStatusMutation.mutate(record._id)}
          checkedChildren="Hiện"
          unCheckedChildren="Ẩn"
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center",
      render: (_: unknown, record: Banner) => (
        <Popconfirm
          title="Xác nhận xóa banner?"
          description="Bạn có chắc chắn muốn xóa banner này không?"
          onConfirm={() => handleDelete(record._id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={deletingId === record._id}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-5">
      <h2 className="text-3xl mb-5 font-semibold">DANH SÁCH BANNER</h2>
      <div className="flex justify-between items-center mb-5">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/banner/add")}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        dataSource={filteredBanners}
        columns={columns}
        rowKey="_id"
        pagination={{
          pageSize: 10,
        }}
        bordered
        loading={isLoading}
        scroll={{ x: 1000, y: 55 * 7 }}
        size="middle"
      />
    </div>
  );
};

export default AdminBannerList;
