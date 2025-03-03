import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Image,
  message,
  Modal,
  Select,
  Skeleton,
  Table,
  TableProps,
  Tag,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../../../interface/Order";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { ItemOrder } from "../../../interface/ItemOrder";
import { useForm } from "antd/es/form/Form";

const AdminOrderDetail = () => {
  const [dataOrder, setDataOrder] = useState<Order>();
  const [dataItemOrder, setDataItemOrder] = useState<ItemOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [form] = useForm();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const url = `http://localhost:3000/api/orders/${id}?_embed=user,voucher,payment,itemsOrder`;
  const key = "dataPageOrder";

  const { data: orderDetail, isLoading } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await axios.get(url);
      console.log("response", response);

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
  // console.log("dataItemOrder", dataItemOrder);
  useEffect(() => {
    setIsDisabled(
      orderDetail?.status === "Đã hủy" || orderDetail?.status === "Hoàn đơn"
    );
  }, [orderDetail?.status]);
  //colums
  const columns: TableProps<ItemOrder>["columns"] = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 50,
      render: (_: unknown, record: ItemOrder) => {
        return (
          <Image
            src={record?.id_variant?.image[0]}
            width={50}
            height={50}
          ></Image>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 50,
    },
    {
      title: "Màu sắc",
      dataIndex: "id_color",
      key: "id_color",
      width: 50,
      render: (_: unknown, record: ItemOrder) => {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ minWidth: "40px" }}>
                {record?.id_variant?.id_color?.name}
              </p>
              <div
                style={{
                  marginLeft: "5px",
                  backgroundColor: record?.id_variant?.id_color?.hexcode,
                  width: "20px",
                  height: "20px",
                  border:
                    record?.id_variant?.id_color?.hexcode == "#ffffff"
                      ? "1px solid gray"
                      : "none",
                }}
              ></div>
            </div>
          </>
        );
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "id_size",
      key: "id_size",
      width: 50,
      render: (_: unknown, record: ItemOrder) => {
        return (
          <>
            <span>{record?.id_variant?.id_size?.name}</span>
          </>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "id_product",
      key: "id_product",
      width: 50,
      render: (_: unknown, record: ItemOrder) => {
        return (
          <>
            <span>{record?.id_variant?.id_product?.price}</span>
          </>
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
    const validTransitions: Record<string, string[]> = {
      "Chưa xác nhận": ["Đã xác nhận", "Đã hủy"],
      "Đã xác nhận": ["Đang giao", "Đã hủy"],
      "Đang giao": ["Hoàn thành"],
      "Hoàn thành": ["Đã hủy"],
      "Đã hủy": [],
    };

    // Lấy trạng thái hiện tại của đơn hàng từ form
    const currentStatus = form.getFieldValue("status") || orderDetail?.status;
    setAvailableStatuses(validTransitions[currentStatus] || []);
  }, [form, orderDetail?.status]);

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
    <div>
      <h1 className="mb-2 text-[24px]">CHI TIẾT ĐƠN HÀNG</h1>
      <Skeleton loading={isLoading}>
        <div className="w-full">
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Mã đơn hàng:</p>
            <p>{dataOrder?._id.toString()}</p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Ngày tạo:</p>
            <p>{dayjs(dataOrder?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Khách hàng: </p>
            <p>{dataOrder?.user?.name}</p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Thông tin người nhận: </p>
            {/* <p>{dataOrder?.receiverInfo}</p> */}
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Xác nhận của khách </p>
            <p>
              {dataOrder?.isConfirm ? (
                <Tag color="green">Đã nhận</Tag>
              ) : (
                <Tag color="red">Chưa nhận</Tag>
              )}
            </p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Phí vận chuyển: </p>
            <p>{dataOrder?.shippingFee} VNĐ</p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Mã giảm giá: </p>
            <p>{dataOrder?.voucher?.value} </p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Tổng hóa hóa đơn: </p>
            <p>{dataOrder?.total} VNĐ</p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]">Thanh toán:</p>
            <p>
              {dataOrder?.isPaid ? (
                <Tag color="green">Đã thanh toán</Tag>
              ) : (
                <Tag color="red">Chưa thanh toán</Tag>
              )}
            </p>
          </div>
          <div className="flex m-1 text-[16px]">
            <p className="min-w-[200px]"> Phương thức TT:</p>
            <p> {dataOrder?.payment?.name}</p>
          </div>
          <div className="flex m-1 text-[16px] items-center">
            <p className="min-w-[200px]">Trạng thái đơn hàng:</p>
            <p
              className={`${
                dataOrder?.status === "Hoàn thành"
                  ? "text-green-500"
                  : dataOrder?.status === "Chưa xác nhận"
                  ? "text-yellow-500"
                  : dataOrder?.status === "Hoàn đơn"
                  ? "text-purple-500"
                  : dataOrder?.status === "Đã hủy"
                  ? "text-red-500"
                  : "text-blue-400"
              } font-medium`}
            >
              {dataOrder?.status}
            </p>
            <div className="mt-2 ml-2">
              <Button type="primary" onClick={showModal} disabled={isDisabled}>
                Cập nhật trạng thái
              </Button>
              <Modal
                title="Cập nhật trạng thái đơn hàng"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
              >
                <div>
                  <div className="flex mb-3 ml-2">
                    <p className="min-w-[100px]">Mã đơn hàng:</p>
                    <p>{dataOrder?._id.toString()}</p>
                  </div>
                  <div>
                    <Form
                      form={form}
                      initialValues={dataItemOrder}
                      labelCol={{
                        span: 4,
                      }}
                      wrapperCol={{
                        span: 14,
                      }}
                      layout="horizontal"
                      style={{
                        maxWidth: 600,
                        margin: "0 auto",
                      }}
                      onFinish={mutate}
                    >
                      <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn trạng thái",
                          },
                        ]}
                      >
                        <Select onChange={() => setIsEdit(false)}>
                          {availableStatuses?.map((item: string) => (
                            <Select.Option value={item}>{item}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button htmlType="submit" disabled={isEdit}>
                          Edit
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          <div className="flex">
            <p className="min-w-[200px] text-[18px]">
              Thông tin sản phẩm đã mua{" "}
            </p>
          </div>

          <div className="mt-4">
            <Table
              dataSource={dataItemOrder}
              columns={columns}
              pagination={false}
              scroll={{ y: 55 * 3 }}
            />
          </div>
        </div>
      </Skeleton>
    </div>
  );
};

export default AdminOrderDetail;
