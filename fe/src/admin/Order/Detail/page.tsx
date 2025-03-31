import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Skeleton,
  Table,
  TableProps,
  Tag,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Badge,
  Descriptions,
  BadgeProps,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../../../interface/Order";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { ItemOrder } from "../../../interface/ItemOrder";
import { useForm } from "antd/es/form/Form";

const { Title, Text } = Typography;

const AdminOrderDetail = () => {
  const [dataOrder, setDataOrder] = useState<Order>();
  const [dataItemOrder, setDataItemOrder] = useState<ItemOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [form] = useForm();
  const queryClient = useQueryClient();
  const { id } = useParams();

  //Thông tin admin
  const userName = localStorage.getItem("nameUser");

  const url = `http://localhost:3000/api/orders/${id}?_embed=user,voucher,payment,itemsOrder,receiverInfo`;
  const key = "dataPageOrder";

  const { data: orderDetail, isLoading } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
  });

  useEffect(() => {
    if (orderDetail) {
      setDataOrder(orderDetail);
      setDataItemOrder(orderDetail.itemsOrder);
      form.setFieldsValue({
        status: orderDetail.status,
      });
      if (
        orderDetail?.status === "Đã hủy" ||
        orderDetail?.status === "Hoàn đơn"
      ) {
        setIsDisabled(true);
      }
    }
  }, [orderDetail, form]);

  useEffect(() => {
    setIsDisabled(
      orderDetail?.status === "Đã hủy" || orderDetail?.status === "Hoàn đơn"
    );
  }, [orderDetail?.status]);

  // Get status color

  const getStatusColor = (status: string | undefined): BadgeProps["status"] => {
    switch (status) {
      case "Hoàn thành":
        return "success";
      case "Chưa xác nhận":
        return "warning";
      case "Đang giao":
        return "processing";
      case "Đã hủy":
        return "error";
      case "Đã xác nhận":
        return "processing";
      default:
        return "warning";
    }
  };

  //colums
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
            style={{ objectFit: "cover", borderRadius: "4px" }}
            preview={true}
          />
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Màu sắc",
      dataIndex: "id_color",
      key: "id_color",
      width: 120,
      render: (_: unknown, record: ItemOrder) => {
        return (
          <Space>
            <Text>{record?.id_variant?.id_color?.name}</Text>
            <div
              style={{
                backgroundColor: record?.id_variant?.id_color?.hexcode,
                width: "20px",
                height: "20px",
                border:
                  record?.id_variant?.id_color?.hexcode === "#ffffff"
                    ? "1px solid #d9d9d9"
                    : "none",
                borderRadius: "2px",
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "id_size",
      key: "id_size",
      width: 100,
      render: (_: unknown, record: ItemOrder) => {
        return <Tag>{record?.id_variant?.id_size?.name}</Tag>;
      },
    },
    {
      title: "Giá",
      dataIndex: "id_product",
      key: "id_product",
      width: 150,
      render: (_: unknown, record: ItemOrder) => {
        return (
          <Text strong>
            {Number(record?.id_variant?.id_product?.price).toLocaleString(
              "vi-VN"
            )}{" "}
            VNĐ
          </Text>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity) => (
        <Badge
          count={quantity}
          showZero
          style={{ backgroundColor: "#52c41a" }}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      render: (_: unknown, record: ItemOrder) => {
        const total =
          Number(record?.id_variant?.id_product?.price || 0) *
          Number(record?.quantity || 0);
        return (
          <Text type="danger" strong>
            {total.toLocaleString("vi-VN")} VNĐ
          </Text>
        );
      },
    },
  ];

  // Modal edit status
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  useEffect(() => {
    // Tạo bảng chuyển đổi trạng thái dựa trên điều kiện hiện tại
    let validTransitions: Record<string, string[]> = {};

    // Kiểm tra nếu khách hàng đã xác nhận nhận hàng
    if (dataOrder?.isConfirm) {
      // Nếu đã xác nhận, không cho phép chuyển sang trạng thái "Đã hủy" từ "Hoàn thành"
      validTransitions = {
        "Chưa xác nhận": ["Đã xác nhận", "Đã hủy"],
        "Đã xác nhận": ["Đang giao", "Đã hủy"],
        "Đang giao": ["Hoàn thành"],
        "Hoàn thành": [], // Không có lựa chọn "Đã hủy" nếu khách đã xác nhận
        "Đã hủy": [],
      };
    } else {
      // Cấu hình chuyển đổi ban đầu nếu khách chưa xác nhận
      validTransitions = {
        "Chưa xác nhận": ["Đã xác nhận", "Đã hủy"],
        "Đã xác nhận": ["Đang giao", "Đã hủy"],
        "Đang giao": ["Hoàn thành"],
        "Hoàn thành": ["Đã hủy"], // Có thể hủy nếu khách chưa xác nhận
        "Đã hủy": [],
      };
    }

    // Lấy trạng thái hiện tại của đơn hàng từ form
    const currentStatus = form.getFieldValue("status") || orderDetail?.status;
    setAvailableStatuses(validTransitions[currentStatus] || []);
  }, [form, orderDetail?.status, dataOrder?.isConfirm]);

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      await axios.patch(`http://localhost:3000/api/orders/${id}`, formData);
    },

    onSuccess: () => {
      message.success("Cập nhật trạng thái đơn hàng thành công");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Title level={2} style={{ marginBottom: 24 }}>
        CHI TIẾT ĐƠN HÀNG
      </Title>

      <Skeleton loading={isLoading} active paragraph={{ rows: 10 }}>
        <Card bordered={false} className="mb-6">
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <Badge.Ribbon
                text={dataOrder?.status}
                color={getStatusColor(dataOrder?.status ?? "")}
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                <Card
                  title={
                    <Space>
                      <Text strong>Mã đơn hàng:</Text>
                      <Text copyable>{dataOrder?._id.toString()}</Text>
                    </Space>
                  }
                  style={{ backgroundColor: "#f9f9f9" }}
                >
                  <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                    <Descriptions.Item label="Ngày tạo" span={2}>
                      {dayjs(dataOrder?.createdAt).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Khách hàng" span={2}>
                      {dataOrder?.user?.name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Thanh toán" span={2}>
                      <Space>
                        {dataOrder?.isPaid ? (
                          <Tag color="success">Đã thanh toán</Tag>
                        ) : (
                          <Tag color="error">Chưa thanh toán</Tag>
                        )}
                        <Text type="secondary">
                          ({dataOrder?.payment?.name})
                        </Text>
                      </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Xác nhận của khách" span={2}>
                      {dataOrder?.isConfirm ? (
                        <Tag color="success">Đã nhận</Tag>
                      ) : (
                        <Tag color="error">Chưa nhận</Tag>
                      )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phí vận chuyển" span={2}>
                      <Text>
                        {Number(dataOrder?.shippingFee).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Mã giảm giá" span={2}>
                      {dataOrder?.voucher?.value ? (
                        <Tag color="volcano">{dataOrder?.voucher?.value}</Tag>
                      ) : (
                        <Text type="secondary">Không sử dụng</Text>
                      )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Tổng hóa đơn" span={2}>
                      <Text strong type="danger" style={{ fontSize: 16 }}>
                        {Number(dataOrder?.total).toLocaleString("vi-VN")} VNĐ
                      </Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Cập nhật bởi" span={2}>
                      {dataOrder?.updatedStatusByAdmin ? (
                        <Tag color="blue">
                          {dataOrder?.updatedStatusByAdmin}
                        </Tag>
                      ) : (
                        <Text type="secondary">Chưa được cập nhật</Text>
                      )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái đơn hàng" span={2}>
                      <Space>
                        <Badge
                          status={getStatusColor(dataOrder?.status)}
                          text={
                            <Text
                              strong
                              style={{
                                color:
                                  dataOrder?.status === "Hoàn thành"
                                    ? "#52c41a"
                                    : dataOrder?.status === "Chưa xác nhận"
                                    ? "#faad14"
                                    : dataOrder?.status === "Đang giao"
                                    ? "#722ed1"
                                    : dataOrder?.status === "Đã hủy"
                                    ? "#f5222d"
                                    : "#1890ff",
                              }}
                            >
                              {dataOrder?.status}
                            </Text>
                          }
                        />
                        <Button
                          type="primary"
                          onClick={showModal}
                          disabled={isDisabled}
                          size="small"
                        >
                          Cập nhật trạng thái
                        </Button>
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Badge.Ribbon>
            </Col>
          </Row>
        </Card>

        <Card
          title="Thông tin người nhận"
          bordered={false}
          className="mb-6"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ tên">
              <Text strong>{String(dataOrder?.receiverInfo?.name ?? "")}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <Text copyable>
                {String(dataOrder?.receiverInfo?.phone ?? "")}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              <Text>{String(dataOrder?.receiverInfo?.address ?? "")}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title={<Title level={4}>Thông tin sản phẩm đã mua</Title>}
          bordered={false}
        >
          <Table
            dataSource={dataItemOrder}
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content" }}
            rowKey="_id"
            bordered
            summary={(pageData) => {
              let totalPrice = 0;
              pageData.forEach(({ quantity, id_variant }) => {
                totalPrice +=
                  Number(id_variant?.id_product?.price ?? 0) * Number(quantity);
              });

              return (
                <Table.Summary fixed="bottom">
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5} align="right">
                      <Text strong>Tổng cộng:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      <Text type="danger" strong style={{ fontSize: 16 }}>
                        {totalPrice.toLocaleString("vi-VN")} VNĐ
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </Card>
      </Skeleton>

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        maskClosable={false}
      >
        <Divider />
        <Card bordered={false} style={{ backgroundColor: "#f5f5f5" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Space>
              <Text strong>Mã đơn hàng:</Text>
              <Text copyable>{dataOrder?._id.toString()}</Text>
            </Space>
            <Space>
              <Text strong>Trạng thái hiện tại:</Text>
              <Badge
                status={getStatusColor(dataOrder?.status)}
                text={dataOrder?.status}
              />
            </Space>
            <Space>
              <Text strong>Xác nhận của khách:</Text>
              {dataOrder?.isConfirm ? (
                <Tag color="success">Đã nhận</Tag>
              ) : (
                <Tag color="error">Chưa nhận</Tag>
              )}
            </Space>
          </Space>
        </Card>
        <Divider />
        <Form
          form={form}
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
            values.updatedStatusByAdmin = userName;
            mutate(values);
          }}
        >
          <Form.Item name="updatedStatusByAdmin" hidden>
            <Input value={userName || ""} readOnly />
          </Form.Item>
          <Form.Item
            label="Trạng thái mới"
            name="status"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái",
              },
            ]}
          >
            <Select
              onChange={() => setIsEdit(false)}
              placeholder="Chọn trạng thái mới"
              style={{ width: "100%" }}
              disabled={availableStatuses.length === 0}
              notFoundContent="Không có trạng thái khả dụng"
            >
              {availableStatuses?.map((item: string) => (
                <Select.Option key={item} value={item}>
                  <Badge status={getStatusColor(item)} text={item} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isEdit || availableStatuses.length === 0}
              >
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOrderDetail;
