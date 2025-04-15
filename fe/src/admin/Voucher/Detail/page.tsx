
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Voucher } from "../../../interface/Voucher";
import {
  Descriptions,
  Tag,
  Spin,
  Alert,
  Button,
  Typography,
  Progress,
  Badge
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PercentageOutlined,
  GiftOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;



const VoucherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/vouchers/${id}`);
        setVoucher(res.data.data);
      } catch {
        setError("Không thể tải dữ liệu voucher");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const getStatusTag = (voucher: Voucher) => {
    const now = new Date();
    const start = new Date(voucher.startTime);
    const end = new Date(voucher.endTime);
    if (now < start) return <Tag color="gold">Chưa bắt đầu</Tag>;
    if (now > end) return <Tag color="default">Đã kết thúc</Tag>;
    return voucher.status ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>;
  };

  const getTimeProgress = (voucher: Voucher) => {
  const now = new Date();
  const start = new Date(voucher.startTime);
  const end = new Date(voucher.endTime);
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();

  if (now < start) return { status: "Chưa bắt đầu", percent: 0, badgeStatus: "warning" as const };
  if (now > end) return { status: "Đã kết thúc", percent: 100, badgeStatus: "default" as const };
  return {
    status: "Đang diễn ra",
    percent: Math.round((elapsed / total) * 100),
    badgeStatus: "processing" as const
  };
};


  const formatDate = (date: Date) =>
    new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });

  if (loading) {
    return <Spin tip="Đang tải..." style={{ display: "block", marginTop: 100 }} />;
  }

  if (error || !voucher) {
    return (
      <Alert
        message="Lỗi"
        description={error || "Voucher không tồn tại"}
        type="error"
        showIcon
        action={
          <Button onClick={() => navigate("/admin/voucher")} type="primary">
            Quay lại
          </Button>
        }
      />
    );
  }

  const timeStatus = getTimeProgress(voucher);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={3}><GiftOutlined /> Chi tiết Voucher</Title>
        <div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/voucher")} style={{ marginRight: 8 }}>
            Trở lại
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin/voucher/${id}/edit`)}>
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên voucher">
          <Text strong>{voucher.title}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Mã code">
          <Text code>{voucher.codeName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{getStatusTag(voucher)}</Descriptions.Item>
        <Descriptions.Item label="Giảm giá">
          <Tag color="blue"><PercentageOutlined /> {voucher.value}%</Tag> &nbsp;
          <Text type="secondary">Tối đa:</Text> &nbsp;
          <Tag color="orange">{voucher.maxValue.toLocaleString("vi-VN")} VNĐ</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng còn lại">
          {voucher.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Hiệu lực">
         <Badge status={timeStatus.badgeStatus} text={timeStatus.status} />
          <Progress percent={timeStatus.percent} size="small" style={{ marginTop: 8 }} />
          <div style={{ marginTop: 4 }}>
            <CalendarOutlined /> {formatDate(voucher.startTime)} - {formatDate(voucher.endTime)}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <Paragraph>{voucher.description}</Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDate(voucher.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật gần nhất">
          {formatDate(voucher.updatedAt)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default VoucherDetailPage;
