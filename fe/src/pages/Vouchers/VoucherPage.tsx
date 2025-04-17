
import {
  Card,
  Col,
  Row,
  Typography,
  Tag,
  Button,
  message,
  Tooltip,

  Spin,
} from "antd";
import {
  GiftOutlined,
  CopyOutlined,
  CheckCircleOutlined,

} from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Voucher } from "../../interface/Voucher";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;


const VoucherCard = ({ voucher }: { voucher: Voucher }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.codeName);
    setCopied(true);
    message.success(`Đã sao chép mã: ${voucher.codeName}`);
    setTimeout(() => setCopied(false), 1500);
  };

  const getVoucherColor = (value: number): string => {
    if (value >= 50) return "red";
    if (value >= 20) return "volcano";
    if (value >= 10) return "orange";
    return "green";
  };

  const voucherColor = getVoucherColor(voucher.value);

  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        transition: "all 0.3s",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        style={{
          width: "100%",
          height: 160,
          background: `linear-gradient(135deg, ${voucherColor} 0%, #f5f5f5 100%)`,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 36,
          fontWeight: "bold",
        }}
      >
        {voucher.value < 1 ? `${voucher.value * 100}%` : `${voucher.value.toLocaleString()}đ`}
      </div>

      <div style={{ padding: 20 }}>
        <Row justify="space-between" align="middle">
          <Tag
            color={voucherColor}
            style={{ fontSize: 14, padding: "4px 12px", borderRadius: 6 }}
          >
            {voucher.codeName}
          </Tag>
          <Tooltip title={copied ? "Đã sao chép" : "Sao chép mã"}>
            <Button
              shape="circle"
              icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              type={copied ? "primary" : "default"}
              size="small"
            />
          </Tooltip>
        </Row>

        <Title level={4} style={{ marginTop: 12 }}>
          {voucher.title}
        </Title>
        <Paragraph type="secondary" style={{ minHeight: 60 }}>
          {voucher.description}
        </Paragraph>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Hạn sử dụng: <strong>{dayjs(voucher.endTime).format("DD/MM/YYYY")}</strong>
        </Text>

       {!voucher.status || voucher.quantity <= 0 || dayjs().isAfter(voucher.endTime) ? (
  <Button
    type="primary"
    block
    style={{ marginTop: 16, borderRadius: 8 }}
    icon={<GiftOutlined />}
    disabled
  >
    Sử dụng ngay
  </Button>
) : (
  <Link to="/products" style={{ display: "block" }}>
    <Button
      type="primary"
      block
      style={{ marginTop: 16, borderRadius: 8 }}
      icon={<GiftOutlined />}
    >
      Sử dụng ngay
    </Button>
  </Link>
)}

      </div>
    </Card>
  );
};

const VoucherPageBee = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/vouchers');
        if (!response.ok) {
          throw new Error('Failed to fetch vouchers');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setVouchers(data);
        } else if (data.data && Array.isArray(data.data)) {
          setVouchers(data.data);
        } else if (data.vouchers && Array.isArray(data.vouchers)) {
          setVouchers(data.vouchers);
        } else if (data.items && Array.isArray(data.items)) {
          setVouchers(data.items);
        } else {
          setVouchers([]);
        }

        setError(null);
      } catch  {
        setError('Không thể tải danh sách voucher. Vui lòng thử lại sau.');
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        Ưu Đãi Đặc Biệt Dành Cho Bạn <GiftOutlined />
      </Title>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải danh sách voucher...</div>
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Title level={4} type="danger">{error}</Title>
        </div>
      )}

      {!loading && !error && Array.isArray(vouchers) && (
        <Row gutter={[24, 24]}>
          {vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <Col xs={24} sm={12} lg={8} key={voucher._id}>
                <VoucherCard voucher={voucher} />
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center", margin: "40px 0" }}>
              <Title level={4}>Hiện không có voucher nào</Title>
            </Col>
          )}
        </Row>
      )}

      


 

    </div>
  );
};

export default VoucherPageBee;
