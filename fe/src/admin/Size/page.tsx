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
  Modal,
  Typography,
  Descriptions,
  Tag,
  Skeleton,
} from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;

interface Size {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  key?: string;
}

const AdminSizeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSizeData, setSelectedSizeData] = useState<Size | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
          key: size._id.toString(),
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

  const fetchSizeDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/sizes/${id}`);
      setSelectedSizeData(res.data.data);
    } catch (err) {
      message.error("Không thể lấy thông tin chi tiết kích thước!");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const showSizeDetails = (id: string) => {
    fetchSizeDetails(id);
    setDetailModalVisible(true);
  };

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

  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!sizes || sizes.length === 0) {
    return <p>Không có kích thước nào để hiển thị.</p>;
  }

  const columns: TableProps<Size>["columns"] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 100,
      render: (_: string, __: Size, index: number) => index + 1,
    },
    {
      title: "Tên kích thước",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 250,
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
      width: 300,
      render: (value: string) => (
        <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      align: "center",
      render: (_: unknown, size: Size) => {
        const items: MenuProps["items"] = [
          {
            key: "DELETE",
            label: (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa kích thước này?"
                onConfirm={() => handleDelete(size._id.toString())}
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
            <Button onClick={() => showSizeDetails(size._id)} type="primary">
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
      <h2 className="text-3xl mb-5 font-semibold">DANH SÁCH KÍCH THƯỚC</h2>
      <Button
        type="primary"
        onClick={() => navigate("/admin/size/add")}
        style={{ marginBottom: 10 }}
        icon={<PlusOutlined />}
      >
        Thêm mới
      </Button>
      <Table<Size>
        dataSource={sizes}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="_id"
        scroll={{ y: 55 * 7 }}
      />

      {/* Size Detail Modal */}
      <Modal
        title={
          <Title level={4} className="m-0 text-blue-700">
            CHI TIẾT KÍCH THƯỚC
          </Title>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
        centered
      >
        {loadingDetails ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : selectedSizeData ? (
          <Descriptions
            layout="vertical"
            bordered
            column={1}
            labelStyle={{ fontWeight: "bold" }}
          >
            <Descriptions.Item label="Tên kích thước">
              <Tag color="blue" className="text-lg px-4 py-1">
                {selectedSizeData.name}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedSizeData.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày cập nhật">
              {dayjs(selectedSizeData.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Typography.Text type="danger">
            Không tìm thấy thông tin kích thước!
          </Typography.Text>
        )}
      </Modal>
    </div>
  );
};

export default AdminSizeList;
