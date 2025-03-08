import { Table, TableProps } from "antd/lib";
import { Button, Pagination, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Order } from "../../../../interface/Order";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
export default function OrderTable() {
  const id_user = localStorage.getItem("idUser");
  const [dataTable, setDataTable] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [curentPages, setCurentPages] = useState(1);
  const pageSize = 5;

  const url = `http://localhost:3000/api/orders/user/${id_user}?_embed=user,voucher,payment,itemsOrder,id_variant&_page=${curentPages}&_limit=${pageSize}`;
  const key = "dataPageOrder";

  const { data: data_Order } = useQuery({
    queryKey: [key, curentPages],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
  });

  useEffect(() => {
    if (data_Order) {
      setTotalPages(data_Order.totalPages);
      setCurentPages(data_Order.page);
      setDataTable(data_Order.orders);
    }
  }, [data_Order]);

  console.log("dataTable: ", dataTable);

  const columns: TableProps<Order>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 20,
      render: (_: unknown, __: unknown, index: number) => {
        const stt =
          curentPages && pageSize
            ? (curentPages - 1) * pageSize + index + 1
            : "";
        return stt;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: Date) => {
        return (
          <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
            {dayjs(value).format("DD/MM/YYYY")}
          </Tooltip>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 150,
    },

    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      key: "payment",
      width: 150,
      render: (_: unknown, item: Order) => {
        return item?.payment?.name === "Thanh toán khi nhận hàng"
          ? "COD"
          : "VNPay";
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (_: unknown, item: Order) => {
        return item.isPaid ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        );
      },
    },
    {
      title: "Xác nhận của khách hàng",
      dataIndex: "isConfirm",
      key: "isConfirm",
      render: (_: unknown, item: Order) => {
        return item.isConfirm ? (
          <Tag color="green">Đã nhận</Tag>
        ) : (
          <Tag color="red">Chưa nhận</Tag>
        );
      },
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "status",
      key: "status",
      render: (_: unknown, item: Order) => {
        return (
          <p
            className={`${
              item?.status === "Hoàn thành"
                ? "text-green-500"
                : item?.status === "Chưa xác nhận"
                ? "text-yellow-500"
                : item?.status === "Đang giao"
                ? "text-purple-500"
                : item?.status === "Đã hủy"
                ? "text-red-500"
                : "text-blue-400"
            } font-medium`}
          >
            {item?.status}
          </p>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_: unknown, item: Order) => {
        return (
          <div>
            <Link to={`/account/orders/${item._id}`}>
              <Button type="primary">Xem chi tiết</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurentPages(page);
  };
  return (
    <>
      <Table
        rowKey="_id"
        bordered={true}
        columns={columns}
        dataSource={dataTable}
        pagination={false}
      />
      <Space className="-ml-5 mt-4 flex w-full justify-end">
        <Pagination
          pageSize={5}
          onChange={handlePageChange}
          showSizeChanger={false}
          total={totalPages * pageSize}
          current={curentPages}
        />
      </Space>
    </>
  );
}
