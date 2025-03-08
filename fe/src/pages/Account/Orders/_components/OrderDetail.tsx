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
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Order } from "../../../../interface/Order";
import { ItemOrder } from "../../../../interface/ItemOrder";

const OrderDetail = () => {
  const [dataOrder, setDataOrder] = useState<Order>();
  const [dataItemOrder, setDataItemOrder] = useState<ItemOrder[]>([]);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [canCancel, setCanCancel] = useState(false);

  //Thông tin admin

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
    }
  }, [orderDetail]);

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
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      width: 50,
      render: (_: unknown, item: ItemOrder) => {
        return (
          <div>
            <Link to={`/products/${item.id_variant.id_product._id}`}>
              <Button type="primary">Mua hàng</Button>
            </Link>
          </div>
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

    const checkTime = () => {
      const now = new Date();
      setCanCancel(now < threeMinutesLater);
    };

    // Kiểm tra ngay lập tức
    checkTime();

    // Cập nhật mỗi giây để ẩn nút đúng thời điểm
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, [orderDetail?.completedAt]);

  //
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
      // Kiểm tra nếu có response từ backend
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || "Có lỗi xảy ra!");
      } else {
        message.error("Lỗi không xác định!");
      }
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
          <div className="flex m-1 text-[16px] items-center">
            <p className="min-w-[200px]">Xác nhận của khách </p>
            <p>
              {dataOrder?.isConfirm ? (
                <Tag color="green">Đã nhận</Tag>
              ) : (
                <Tag color="red">Chưa nhận</Tag>
              )}
            </p>

            <div className="mt-2 ml-2">
              <Button
                type="primary"
                onClick={() => handleIsConfirm.mutate()}
                hidden={
                  dataOrder?.isConfirm ||
                  dataOrder?.status.trim() !== "Hoàn thành"
                }
              >
                Xác nhận đơn hàng
              </Button>
            </div>
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
              <Popconfirm
                title="Delete the task"
                description="Bạn chắc chắn muốn hủy đơn hàng này không?"
                onConfirm={() => handleCancel.mutate()}
                okText="Hủy"
                cancelText="Không hủy"
              >
                <Button
                  type="primary"
                  danger
                  hidden={
                    dataOrder?.status === "Đang giao" ||
                    dataOrder?.status === "Đã hủy" ||
                    dataOrder?.status === "Hoàn thành"
                  }
                >
                  Hủy đơn hàng
                </Button>
              </Popconfirm>
            </div>
            <div className="mt-2 ml-2">
              <Popconfirm
                title="Delete the task"
                description="Bạn chắc chắn muốn hoàn đơn này không?"
                onConfirm={() => handleCancel.mutate()}
                okText="Có"
                cancelText="Không "
              >
                <Button
                  type="primary"
                  danger
                  hidden={!canCancel || dataOrder?.status === "Đã hủy"}
                >
                  Hoàn đơn
                </Button>
              </Popconfirm>
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

export default OrderDetail;
