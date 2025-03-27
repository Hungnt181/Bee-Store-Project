import { useState, useEffect, useCallback } from "react";
import { Button, Input, message, Modal, Empty } from "antd";
import { DeleteOutlined, SendOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { TextArea } = Input;

interface Comment {
  _id: string;
  id_user?: {
    _id: string;
    name: string;
  };
  noidung_bl: string;
  createdAt: string;
  status: boolean;
}

const ProductComments = ({ productId }: { productId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("idUser"); // đúng key bạn đã dùng khi lưu
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name;
  const isLoggedIn = Boolean(userId);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/comments/product/${productId}`
      );
      const allComments: Comment[] = res.data.data || [];
      const visibleComments = allComments.filter((comment) => comment.status);
      setComments(visibleComments);
    } catch (error) {
      console.error(error);
    }
  }, [productId]); // productId là dependency duy nhất của hàm

  // useEffect sử dụng fetchComments như thường
  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId, fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Vui lòng nhập nội dung!");
      return;
    }

    if (!isLoggedIn) {
      setError("Bạn cần đăng nhập để bình luận!");
      return;
    }

    setLoading(true);
    setError(null); // reset lỗi cũ

    try {
      await axios.post("http://localhost:3000/api/comments", {
        id_product: productId,
        id_user: userId,
        noidung_bl: newComment,
      });

      setNewComment("");
      message.success("Đã thêm bình luận!");

      // ✅ Gọi lại API để load lại comment có populate id_user
      await fetchComments();
    } catch (error: unknown) {
      console.error(error);
      let errMsg = "Không thể thêm bình luận!";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (
    commentId: string,
    commentUserId?: string
  ) => {
    if (!commentUserId || commentUserId !== userId) {
      return message.warning("Bạn chỉ có thể xóa bình luận của mình!");
    }
    Modal.confirm({
      title: "Xác nhận xóa bình luận?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/api/comments/${commentId}`);
          setComments(comments.filter((c) => c._id !== commentId));
          message.success("Đã xóa bình luận!");
        } catch (error) {
          console.error(error);
          message.error("Không thể xóa bình luận!");
        }
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto mt-6 border border-gray-200">
      {/* Tiêu đề */}
      <div className="flex items-center gap-3 mb-5">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">Bình luận</h3>
      </div>
      {isLoggedIn ? (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Xin chào, <strong className="text-red-500">{userName}</strong>
          </p>
          <div className="flex items-start gap-2">
            <TextArea
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Mời bạn để lại bình luận..."
              className="rounded-lg border border-gray-300 w-full"
            />
            <Button
              type="default"
              icon={<SendOutlined />}
              onClick={handleAddComment}
              loading={loading}
              className="bg-red-500 hover:bg-red-600 border-none text-white px-4 py-1.5 rounded-lg shadow-md h-auto mt-1"
            >
              Gửi
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      ) : (
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Bạn cần đăng nhập để bình luận
          </p>
          <Button
            type="primary"
            href="/signin" // <-- thêm đường dẫn đăng nhập của bạn ở đây
            className="bg-red-500 hover:bg-red-600 border-none rounded-lg shadow-md"
          >
            Đăng nhập ngay
          </Button>
        </div>
      )}

      {/* Danh sách bình luận */}
      {comments.length === 0 ? (
        <Empty description="Chưa có bình luận nào" />
      ) : (
        <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
          {comments
            .slice()
            .reverse()
            .map((comment) => (
              <div
                key={comment._id}
                className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl group shadow-sm"
              >
                {/* Avatar */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white font-bold">
                  {comment.id_user?.name?.charAt(0) || "U"}
                </div>

                {/* Nội dung và nút xóa */}
                <div className="flex-1 flex flex-col gap-1">
                  {/* Tên - thời gian */}
                  <div className="text-sm text-gray-800 font-semibold">
                    {comment.id_user?.name || "Người dùng ẩn danh"}{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      - {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>

                  {/* Nội dung + nút xoá */}
                  <div className="flex justify-between items-start">
                    <p className="text-gray-700 text-sm whitespace-pre-line pr-2">
                      {comment.noidung_bl}
                    </p>
                    {isLoggedIn && comment.id_user?._id === userId && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          handleDeleteComment(comment._id, comment.id_user?._id)
                        }
                        className="hover:text-red-600"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProductComments;
