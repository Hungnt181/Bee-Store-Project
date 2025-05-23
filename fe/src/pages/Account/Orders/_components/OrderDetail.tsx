import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Image,
  message,
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
  Modal,
  Input,
  Form,
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
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

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
            {new Intl.NumberFormat("vi-VN").format(Number(record?.price) || 0)}
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
      // console.log(dataOrder?.total);
      if (dataOrder) {
        localStorage.setItem("createdOrderId", dataOrder._id.toString());
      }
      const response = await axios.post(
        "http://localhost:3000/vnpay/create_payment_url",
        {
          amount: dataOrder?.total,
          orderId: dataItemOrder[0].id_variant._id + "_" + Date.now(),
        }
      );
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

  // Modal Hủy đơn hàng
  const [formCancel] = useForm();
  const user = localStorage.getItem("user");
  const userName = user ? JSON.parse(user).name : "Khách hàng";
  useEffect(() => {
    formCancel.setFieldsValue({
      updatedStatusByClient: userName, // Thiết lập giá trị cho trường "Người hủy"
    });
  }, [formCancel, userName]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { mutate: cancelMutate } = useMutation({
    mutationFn: async (formData) => {
      await axios.patch(
        `http://localhost:3000/api/orders/client/${id}`,
        formData
      );
    },
    onSuccess: () => {
      message.success("Hủy đơn hàng thành công");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  // Modal khiếu nại đơn hàng
  const emailUser = user ? JSON.parse(user).email : "noemail";
  const id_User = user ? JSON.parse(user)._id : "null";
  const [formComplaint] = useForm();

  useEffect(() => {
    formComplaint.setFieldsValue({
      name: userName,
      id_order: dataOrder?._id.toString(),
      id_user: id_User,
      email: emailUser,
    });
  }, [formComplaint, userName, id_User, emailUser, dataOrder]);

  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const { mutate: ComplaintMutate } = useMutation({
    mutationFn: async (formData) => {
      await axios.post(`http://localhost:3000/api/complaint`, formData);
    },
    onSuccess: () => {
      message.success(
        "Khiếu nại thành công! Chúng tôi sẽ liên hệ tới bạn sớm nhất để xử lý."
      );
      setIsModalOpen2(false);
      queryClient.invalidateQueries({ queryKey: [key] });
    },

    onError: (error) => {
      // Gợi ý thêm: kiểm tra nếu có response từ server
      if (error?.message) {
        message.error(`Vui lòng xác nhận đã nhận hàng trước khi khiếu nại`);
      } else {
        message.error("Tạo khiếu nại thất bại. Vui lòng thử lại sau.");
      }
    },
  });

  // xét time hết hạn khiếu nại
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (dataOrder?.completedAt) {
      const interval = setInterval(() => {
        const timePassed =
          Date.now() -
          (dataOrder?.completedAt
            ? new Date(dataOrder.completedAt).getTime()
            : 0);
        const timeLeft = 3 * 60 * 1000 - timePassed;

        if (timeLeft <= 0) {
          setRemainingTime(0);
          clearInterval(interval);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dataOrder]);

  // if (!dataOrder?.completedAt || remainingTime <= 0) return null;

  // const minutes = Math.floor(remainingTime / 60000);
  // const seconds = Math.floor((remainingTime % 60000) / 1000);

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <Skeleton loading={isLoading} active>
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Title level={3} style={{ margin: 0 }}>
              CHI TIẾT ĐƠN HÀNG - {dataOrder?._id.toString().slice(-6)}
            </Title>
            <Space>
              {!dataOrder?.isPaid &&
                dataOrder?.payment?.name != "Thanh toán khi nhận hàng" &&
                dataOrder?.status != "Đã hủy" && (
                  <Button
                    type="primary"
                    disabled={dataOrder?.status == "Giao hàng thất bại"}
                    onClick={() => handleOnlinePayment()}
                  >
                    Thanh toán đơn hàng
                  </Button>
                )}
              {dataOrder?.status !== "Đã hủy" &&
                dataOrder?.status !== "Hoàn thành" &&
                dataOrder?.status !== "Đang giao" && (
                  <Button
                    danger
                    onClick={showModal}
                    type="primary"
                    icon={<StopOutlined />}
                    disabled={dataOrder?.status == "Giao hàng thất bại"}
                  >
                    Hủy đơn hàng
                  </Button>
                )}

              {dataOrder?.status === "Hoàn thành" &&
                remainingTime > 0 &&
                !dataOrder?.isComplaint && (
                  <div>
                    <Button
                      type="primary"
                      className="mr-2"
                      danger
                      icon={<ExclamationCircleFilled />}
                      onClick={showModal2}
                    >
                      Khiếu nại
                    </Button>
                  </div>
                )}

              {dataOrder?.status === "Hoàn thành" && !dataOrder?.isConfirm && (
                <div>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleIsConfirm.mutate()}
                  >
                    Xác nhận đã nhận hàng
                  </Button>
                </div>
              )}
            </Space>

            {/* Modal hủy*/}
            <Modal
              title="Lý do hủy đơn hàng"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
              destroyOnClose
              maskClosable={false}
            >
              <Divider />
              <Card bordered={false} style={{ backgroundColor: "#f5f5f5" }}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Space>
                    <Text strong>Mã đơn hàng:</Text>
                    <Text copyable>{dataOrder?._id.toString()}</Text>
                  </Space>
                </Space>
              </Card>
              <Divider />
              <Form
                form={formCancel}
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 600,
                  margin: "0 auto",
                }}
                onFinish={(values) => {
                  values.cancel_by = userName;
                  cancelMutate(values);
                }}
              >
                <Form.Item name="updatedStatusByClient" label="Người hủy">
                  <Input value={userName || ""} readOnly />
                </Form.Item>
                <Form.Item
                  label="Lý do hủy"
                  name="cancel_reason"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lý do hủy đơn hàng",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập lý do hủy đơn hàng..."
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Space>
                    <Button onClick={handleCancel}>Hủy</Button>
                    <Button type="primary" htmlType="submit">
                      Hủy đơn hàng
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal khiếu nại */}
            <Modal
              title="Nội dung khiếu nại đơn hàng"
              open={isModalOpen2}
              onOk={handleOk2}
              onCancel={handleCancel2}
              footer={null}
              destroyOnClose
              maskClosable={false}
            >
              <Divider />
              <Card bordered={false} style={{ backgroundColor: "#f5f5f5" }}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Space>
                    <Text strong>Mã đơn hàng:</Text>
                    <Text copyable>{dataOrder?._id.toString()}</Text>
                  </Space>
                </Space>
              </Card>
              <Divider />
              <Form
                form={formComplaint}
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 600,
                  margin: "0 auto",
                }}
                onFinish={(value) => {
                  value.status = "Chờ xử lý";
                  ComplaintMutate(value);
                }}
              >
                <Form.Item name="name" label="Họ và tên">
                  <Input value={userName || ""} readOnly />
                </Form.Item>
                <Form.Item name="email" label="email">
                  <Input value={emailUser || ""} readOnly />
                </Form.Item>
                <Form.Item name="id_user" label="id_user" hidden={true}>
                  <Input value={id_User || ""} readOnly />
                </Form.Item>
                <Form.Item name="id_order" label="Mã đơn hàng" hidden={true}>
                  <Input value={dataOrder?._id.toString()} readOnly />
                </Form.Item>
                <Form.Item
                  label="Nội dung khiếu nại"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung khiếu nại",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập nội dung khiếu nại..."
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Space>
                    <Button onClick={handleCancel2}>Hủy</Button>
                    <Button type="primary" htmlType="submit">
                      Khiếu nại
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>

          {dataOrder?.status !== "Đã hủy" &&
          dataOrder?.status !== "Giao hàng thất bại" ? (
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
          ) : dataOrder?.status === "Đã hủy" ? (
            <Card className="bg-red-50 mb-6">
              <div className="flex items-center text-red-500">
                <StopOutlined
                  style={{ fontSize: "24px", marginRight: "8px" }}
                />
                <Text strong style={{ color: "red" }}>
                  {dataOrder?.cancel_reason ==
                  "Đơn hàng đã huỷ tự động do quá thời gian thanh toán"
                    ? "Đơn hàng đã huỷ tự động do quá thời gian thanh toán"
                    : "Đơn hàng đã bị hủy"}{" "}
                  {dataOrder?.payment?.name === "Thanh toán qua VNPay" &&
                    dataOrder?.isPaid &&
                    dataOrder?.status === "Đã hủy" && (
                      <span style={{ color: "blue" }}>
                        {" "}
                        - Cửa hàng sẽ hoàn tiền cho bạn trong vòng 3-5 ngày làm
                        việc
                      </span>
                    )}
                </Text>
              </div>
            </Card>
          ) : (
            <Card className="bg-red-50 mb-6">
              <div className="flex items-center text-red-500">
                <StopOutlined
                  style={{ fontSize: "24px", marginRight: "8px" }}
                />
                <Text strong style={{ color: "red" }}>
                  Giao hàng thất bại
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
                  {dataOrder?.isConfirm && dataOrder?.isComplaint && (
                    <div className="flex justify-between" color="warning">
                      <Text>Trạng thái khiếu nại:</Text>
                      <Tag
                        color={!dataOrder?.isComplaint ? "success" : "error"}
                      >
                        {dataOrder?.isComplaint ? "Chờ xử lý" : null}
                      </Tag>
                    </div>
                  )}
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
                            Number(item?.price ?? 0) *
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
