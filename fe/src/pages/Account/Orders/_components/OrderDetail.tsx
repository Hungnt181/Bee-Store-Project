import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Skeleton,
  Table,
  TableProps,
  Tag,
  Card,
  Divider,
  Steps,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Order } from "../../../../interface/Order";
import { ItemOrder } from "../../../../interface/ItemOrder";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  StopOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderDetail = () => {
  const [dataOrder, setDataOrder] = useState<Order>();
  const [dataItemOrder, setDataItemOrder] = useState<ItemOrder[]>([]);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const url = `http://localhost:3000/api/orders/${id}?_embed=user,voucher,payment,itemsOrder`;
  const key = "dataPageOrder";

  const { data: orderDetail, isLoading } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await axios.get(url);
      // console.log("response", response);
      return response.data;
    },
  });

  useEffect(() => {
    if (orderDetail) {
      setDataOrder(orderDetail);
      setDataItemOrder(orderDetail.itemsOrder);
    }
  }, [orderDetail]);

  const columns: TableProps<ItemOrder>["columns"] = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (_: unknown, record: ItemOrder) => {
        return (
          <Image
            src={record?.id_variant?.image[0]}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: "8px" }}
            preview={{ mask: <div>Xem</div> }}
          ></Image>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Màu sắc",
      dataIndex: "id_color",
      key: "id_color",
      render: (_: unknown, record: ItemOrder) => {
        return (
          <Space>
            <Text>{record?.id_variant?.id_color?.name}</Text>
            <div
              style={{
                backgroundColor: record?.id_variant?.id_color?.hexcode,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border:
                  record?.id_variant?.id_color?.hexcode === "#ffffff"
                    ? "1px solid gray"
                    : "none",
              }}
            ></div>
          </Space>
        );
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "id_size",
      key: "id_size",
      render: (_: unknown, record: ItemOrder) => {
        return <Tag>{record?.id_variant?.id_size?.name}</Tag>;
      },
    },
    {
      title: "Giá",
      dataIndex: "id_product",
      key: "id_product",
      render: (_: unknown, record: ItemOrder) => {
        return (
          <Text type="danger" strong>
            {new Intl.NumberFormat("vi-VN").format(
              record?.id_variant?.id_product?.price
            )}{" "}
            ₫
          </Text>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <Tag color="processing">{quantity}</Tag>,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_: unknown, item: ItemOrder) => {
        return (
          <Link to={`/products/${item.id_variant.id_product._id}`}>
            <Button type="primary" icon={<ShoppingCartOutlined />}>
              Mua lại
            </Button>
          </Link>
        );
      },
    },
  ];

  // Isconfirm
  const handleIsConfirm = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `http://localhost:3000/api/orders/client/confirm/${id}`
      );
    },
    onSuccess: () => {
      message.success("Cập nhật trạng thái đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  // Status
  useEffect(() => {
    if (!orderDetail?.completedAt) return;

    const completedTime = new Date(orderDetail.completedAt);
    const threeMinutesLater = new Date(completedTime);
    threeMinutesLater.setMinutes(completedTime.getMinutes() + 3);
  }, [orderDetail?.completedAt]);

  const handleCancel = useMutation({
    mutationFn: async () => {
      await axios.patch(`http://localhost:3000/api/orders/client/${id}`);
    },
    onSuccess: () => {
      message.success("Cập nhật trạng thái đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (error) => {
      console.error("Lỗi từ API:", error);
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || "Có lỗi xảy ra!");
      } else {
        message.error("Lỗi không xác định!");
      }
    },
  });

  // Get current status step
  const getOrderStatusStep = () => {
    switch (dataOrder?.status) {
      case "Chưa xác nhận":
        return 0;
      case "Đã xác nhận":
        return 1;
      case "Đang giao":
        return 2;
      case "Hoàn thành":
        return 3;
      case "Đã hủy":
        return -1;
      default:
        return 0;
    }
  };

  // Thanh toán VNPay
  const handleOnlinePayment = async () => {
    try {
      console.log(dataOrder?.total);
      (dataOrder)?(localStorage.setItem('createdOrderId', dataOrder._id.toString())):'';
      const response = await axios.post("http://localhost:3000/vnpay/create_payment_url", {
        amount: dataOrder?.total,
        orderId: dataItemOrder[0].id_variant._id + "_" + Date.now(),
      });
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      if (error instanceof Error) {
        message.error(
          error.message || "Vui lòng điền đầy đủ thông tin bắt buộc"
        );
      } else {
        message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }
    }
  };


  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <Skeleton loading={isLoading} active>
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Title level={3} style={{ margin: 0 }}>
              CHI TIẾT ĐƠN HÀNG - {dataOrder?._id.toString().slice(-6)}
            </Title>
            <Space>
              {!dataOrder?.isPaid && (
                <Button
                  type="primary"
                onClick={() => handleOnlinePayment()}
                >
                  Thanh toán đơn hàng
                </Button>
              )}
              {dataOrder?.status !== "Đã hủy" &&
                dataOrder?.status !== "Hoàn thành" &&
                dataOrder?.status !== "Đang giao" && (
                  <Popconfirm
                    title="Hủy đơn hàng"
                    description="Bạn chắc chắn muốn hủy đơn hàng này không?"
                    onConfirm={() => handleCancel.mutate()}
                    okText="Hủy"
                    cancelText="Không"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger type="primary" icon={<StopOutlined />}>
                      Hủy đơn hàng
                    </Button>
                  </Popconfirm>
                )}
              {dataOrder?.status === "Hoàn thành" && !dataOrder?.isConfirm && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleIsConfirm.mutate()}
                >
                  Xác nhận đã nhận hàng
                </Button>
              )}
            </Space>
          </div>

          {dataOrder?.status !== "Đã hủy" ? (
            <Steps
              current={getOrderStatusStep()}
              className="mb-6"
              items={[
                {
                  title: "Chờ xác nhận",
                  icon: <ClockCircleOutlined />,
                },
                {
                  title: "Đã xác nhận",
                  icon: <CheckCircleOutlined />,
                },
                {
                  title: "Đang giao",
                  icon: <CarOutlined />,
                },
                {
                  title: "Hoàn thành",
                  icon: <CheckCircleOutlined />,
                },
              ]}
            />
          ) : (
            <Card className="bg-red-50 mb-6">
              <div className="flex items-center text-red-500">
                <StopOutlined
                  style={{ fontSize: "24px", marginRight: "8px" }}
                />
                <Text strong style={{ color: "red" }}>
                  Đơn hàng đã bị hủy
                </Text>
              </div>
            </Card>
          )}

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card type="inner" title="Thông tin đơn hàng" className="h-full">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text>Mã đơn hàng:</Text>
                    <Text copyable strong>
                      {dataOrder?._id.toString()}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Ngày đặt:</Text>
                    <Text>
                      {dayjs(dataOrder?.createdAt).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Trạng thái:</Text>
                    <Tag
                      color={
                        dataOrder?.status === "Hoàn thành"
                          ? "success"
                          : dataOrder?.status === "Chưa xác nhận"
                            ? "warning"
                            : dataOrder?.status === "Đang giao"
                              ? "processing"
                              : dataOrder?.status === "Đã hủy"
                                ? "error"
                                : "blue"
                      }
                    >
                      {dataOrder?.status}
                    </Tag>
                  </div>
                  <div className="flex justify-between">
                    <Text>Xác nhận từ khách:</Text>
                    <Tag color={dataOrder?.isConfirm ? "success" : "error"}>
                      {dataOrder?.isConfirm ? "Đã nhận hàng" : "Chưa nhận hàng"}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card type="inner" title="Thanh toán" className="h-full">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text>Phương thức:</Text>
                    <Text strong>{dataOrder?.payment?.name}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Trạng thái:</Text>
                    <Tag color={dataOrder?.isPaid ? "success" : "error"}>
                      {dataOrder?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Tag>
                  </div>
                  <div className="flex justify-between">
                    <Text>Phí vận chuyển:</Text>
                    <Text>
                      {new Intl.NumberFormat("vi-VN").format(
                        dataOrder?.shippingFee || 0
                      )}{" "}
                      ₫
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Mã giảm giá:</Text>
                    <Text>{dataOrder?.voucher?.value || "Không có"}</Text>
                  </div>
                  <Divider style={{ margin: "12px 0" }} />
                  <div className="flex justify-between">
                    <Text strong>Tổng cộng:</Text>
                    <Text type="danger" strong style={{ fontSize: "16px" }}>
                      {new Intl.NumberFormat("vi-VN").format(
                        dataOrder?.total || 0
                      )}{" "}
                      ₫
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card title={<Title level={4}>Sản phẩm đã mua</Title>}>
          <Table
            dataSource={dataItemOrder}
            columns={columns}
            pagination={false}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            bordered
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5} align="right">
                    <Text strong>Tổng tiền sản phẩm:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={2}>
                    <Text type="danger" strong>
                      {new Intl.NumberFormat("vi-VN").format(
                        dataItemOrder.reduce(
                          (sum, item) =>
                            sum +
                            Number(item?.id_variant?.id_product?.price ?? 0) *
                            Number(item?.quantity ?? 0),
                          0
                        )
                      )}{" "}
                      ₫
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>
      </Skeleton>
    </div>
  );
};

export default OrderDetail;
