import {
  Card,
  Col,
  Row,
  Typography,
  Tag,
  Button,
  message,
  Tooltip,
  Divider,
  List,
  Avatar,
} from "antd";
import {
  GiftOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

// Vouchers data
const vouchers = [
  {
    id: "VOUCHER10",
    title: "🎁 Giảm 10% đơn từ 200K",
    description:
      "Giảm 10% cho đơn hàng từ 200.000đ. Không áp dụng sản phẩm giảm giá.",
    expiry: "2025-03-31",
    color: "blue",
    image:
      "https://lamnghiepbinhthuan.com/Uploads/images/BaiViet/ho%E1%BA%A1t-%C4%91%E1%BB%99ng-khuy%E1%BA%BFn-m%E1%BA%A1i.jpg",
  },
  {
    id: "FREESHIP",
    title: "🚚 Miễn phí vận chuyển",
    description: "Không giới hạn đơn hàng, áp dụng toàn quốc.",
    expiry: "2025-04-15",
    color: "green",
    image:
      "https://lamnghiepbinhthuan.com/Uploads/images/BaiViet/ho%E1%BA%A1t-%C4%91%E1%BB%99ng-khuy%E1%BA%BFn-m%E1%BA%A1i.jpg",
  },
  {
    id: "SUMMER15",
    title: "🌞 Ưu đãi hè -15%",
    description: "Giảm 15% cho đơn từ 300.000đ. Áp dụng 1 lần/người.",
    expiry: "2025-06-30",
    color: "volcano",
    image:
      "https://lamnghiepbinhthuan.com/Uploads/images/BaiViet/ho%E1%BA%A1t-%C4%91%E1%BB%99ng-khuy%E1%BA%BFn-m%E1%BA%A1i.jpg",
  },
];

// News/Promotions data
const promotions = [
  {
    title: "🔥 Chương trình “Mua 1 tặng 1” toàn bộ sản phẩm ngày 1/4",
    description: "Áp dụng duy nhất trong ngày Cá Tháng Tư – số lượng có hạn!",
    image:
      "https://file.hstatic.net/200000472237/article/khuyen-mai-la-gi-3_a28422a6754d4eb1a027587febfad01d.jpg",
    link: "#",
  },
  {
    title: "⚡ Flash Sale cuối tuần - giảm đến 50%",
    description: "Từ 22-24/03, hàng ngàn sản phẩm giảm sốc, đừng bỏ lỡ!",
    image:
      "https://file.hstatic.net/200000472237/article/khuyen-mai-la-gi-3_a28422a6754d4eb1a027587febfad01d.jpg",
    link: "#",
  },
  {
    title: "🎉 Tham gia mini game - nhận voucher 100K",
    description: "Truy cập Fanpage để chơi ngay và nhận quà liền tay.",
    image:
      "https://file.hstatic.net/200000472237/article/khuyen-mai-la-gi-3_a28422a6754d4eb1a027587febfad01d.jpg",
    link: "#",
  },
];

// Voucher Card Component
const VoucherCard = ({ voucher }: { voucher: (typeof vouchers)[0] }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.id);
    setCopied(true);
    message.success(`Đã sao chép mã: ${voucher.id}`);
    setTimeout(() => setCopied(false), 1500);
  };

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
      {/* Image */}
      <img
        src={voucher.image}
        alt={voucher.title}
        style={{
          width: "100%",
          height: 160,
          objectFit: "cover",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />

      <div style={{ padding: 20 }}>
        <Row justify="space-between" align="middle">
          <Tag
            color={voucher.color}
            style={{ fontSize: 14, padding: "4px 12px", borderRadius: 6 }}
          >
            {voucher.id}
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
          Hạn sử dụng:{" "}
          <strong>{dayjs(voucher.expiry).format("DD/MM/YYYY")}</strong>
        </Text>

        <Button
          type="primary"
          block
          style={{ marginTop: 16, borderRadius: 8 }}
          icon={<GiftOutlined />}
        >
          Sử dụng ngay
        </Button>
      </div>
    </Card>
  );
};

// Main Page
const VoucherPageBee = () => {
  return (
    <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Title */}
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        Ưu Đãi Đặc Biệt Dành Cho Bạn <GiftOutlined />
      </Title>

      {/* Vouchers Grid */}
      <Row gutter={[24, 24]}>
        {vouchers.map((voucher) => (
          <Col xs={24} sm={12} lg={8} key={voucher.id}>
            <VoucherCard voucher={voucher} />
          </Col>
        ))}
      </Row>

      {/* Divider */}
      <Divider style={{ marginTop: 48 }}>Tin tức khuyến mãi</Divider>

      {/* Promotions List */}
      <List
        itemLayout="vertical"
        size="large"
        dataSource={promotions}
        renderItem={(promo) => (
          <List.Item
            key={promo.title}
            extra={
              <img
                width={180}
                alt="promo"
                src={promo.image}
                style={{ borderRadius: 12, objectFit: "cover" }}
              />
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<FireOutlined />}
                  style={{ backgroundColor: "red" }}
                />
              }
              title={<a href={promo.link}>{promo.title}</a>}
              description={promo.description}
            />
            <Button type="link" href={promo.link} icon={<ArrowRightOutlined />}>
              Xem chi tiết
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
};

export default VoucherPageBee;
