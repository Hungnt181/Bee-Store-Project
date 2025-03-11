import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  message,
  Form,
  Input,
  Switch,
  Button,
  Modal,
  DatePicker,
  Row,
  Col,
} from "antd";
import { ColumnsType } from "antd/es/table";

import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface Comment {
  _id: string;
  id_product: {
    _id: string;
    name: string;
  };
  id_user: {
    _id: string;
    name: string;
  };
  createdAt: string;
  status: boolean;
  noidung_bl: string;
}

const AdminCommentList = () => {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: comments = [],
    error,
    isLoading,
  } = useQuery<Comment[]>({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/comments");
      const commentsWithDetails = await Promise.all(
        res.data.data.map(async (comment: Comment) => {
          if (!comment.id_product?.name) {
            try {
              const productRes = await axios.get(
                `http://localhost:3000/api/products/${
                  comment.id_product._id || comment.id_product
                }`
              );
              comment.id_product = productRes.data.data;
            } catch {
              comment.id_product = {
                _id:
                  typeof comment.id_product === "string"
                    ? comment.id_product
                    : comment.id_product._id,
                name: "Sản phẩm không tồn tại",
              };
            }
          }

          if (!comment.id_user?.name) {
            try {
              const userRes = await axios.get(
                `http://localhost:3000/api/user_account/${
                  comment.id_user._id || comment.id_user
                }`
              );
              comment.id_user = userRes.data.data;
            } catch {
              comment.id_user = {
                _id:
                  typeof comment.id_user === "string"
                    ? comment.id_user
                    : comment.id_user._id,
                name: "Người dùng không tồn tại",
              };
            }
          }

          return comment;
        })
      );

      return commentsWithDetails.sort(
        (a: Comment, b: Comment) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });

  const toggleStatusMutation = useMutation<
    void,
    Error,
    { id: string; status: boolean }
  >({
    mutationFn: async ({ id, status }) => {
      await axios.patch(
        `http://localhost:3000/api/comments/${id}/toggle-status`,
        { status }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      message.success("Cập nhật trạng thái thành công");
    },
    onError: () => {
      message.error("Không thể cập nhật trạng thái bình luận.");
    },
  });

  useEffect(() => {
    if (error instanceof Error) {
      message.error(`Lỗi khi tải danh sách bình luận! ${error.message}`);
    }
  }, [error]);

  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!comments.length) {
    return <p>Không có bình luận nào để hiển thị.</p>;
  }

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.id_product?.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      comment.id_user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      comment.noidung_bl?.toLowerCase().includes(searchText.toLowerCase());

    const matchesDateRange =
      dateRange[0] && dateRange[1]
        ? dayjs(comment.createdAt).isBetween(
            dateRange[0],
            dateRange[1],
            "day",
            "[]"
          )
        : true;

    return matchesSearch && matchesDateRange;
  });

  const showDetails = (comment: Comment) => {
    setSelectedComment(comment);
    setModalVisible(true);
    setActiveCommentId(comment._id);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveCommentId(null);
  };

  const columns: ColumnsType<Comment> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 80,
      fixed: "left",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Sản phẩm",
      dataIndex: "id_product",
      key: "product_name",
      width: 200,
      render: (product: { name?: string }) => product?.name || "Không có tên",
    },
    {
      title: "Người dùng",
      dataIndex: "id_user",
      key: "user_name",
      width: 200,
      render: (user: { name?: string }) => user?.name || "Người dùng ẩn danh",
    },
    {
      title: "Ngày bình luận",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      title: "Nội dung",
      dataIndex: "noidung_bl",
      key: "noidung_bl",
      width: 250,
      render: (text: string) =>
        text.length > 50 ? text.slice(0, 50) + "..." : text,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: boolean, record: Comment) => (
        <Switch
          checked={status}
          onChange={() =>
            toggleStatusMutation.mutate({
              id: record._id,
              status: !status,
            })
          }
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_: unknown, record: Comment) => (
        <Button
          style={{
            backgroundColor:
              activeCommentId === record._id ? "white" : "#1890ff",
            color: activeCommentId === record._id ? "#1890ff" : "white",
            border: "1px solid #1890ff",
          }}
          onClick={() => showDetails(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>DANH SÁCH BÌNH LUẬN</h2>
      <Form style={{ marginBottom: 10 }}>
        <Row gutter={8} align="middle">
          <Col span={12}>
            <Input
              placeholder="Tìm kiếm theo sản phẩm, người dùng hoặc nội dung"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={12}>
            <RangePicker
              onChange={(dates) =>
                setDateRange(dates ? [dates[0], dates[1]] : [null, null])
              }
            />
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={filteredComments}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="_id"
        scroll={{ y: 500 }}
      />

      <Modal
        title="Chi tiết bình luận"
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedComment && (
          <div>
            <p>
              <strong>Sản phẩm:</strong>{" "}
              {selectedComment.id_product?.name || "Không có tên sản phẩm"}
            </p>
            <p>
              <strong>Người dùng:</strong>{" "}
              {selectedComment.id_user?.name || "Người dùng ẩn danh"}
            </p>
            <p>
              <strong>Ngày bình luận:</strong>{" "}
              {dayjs(selectedComment.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Nội dung:</strong> {selectedComment.noidung_bl}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {selectedComment.status ? "Hiển thị" : "Ẩn"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCommentList;
