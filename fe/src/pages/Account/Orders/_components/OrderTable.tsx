import { Table, TableProps } from "antd";
import { Button, Pagination, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Order } from "../../../../interface/Order";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons"; // Import icon
import { color } from "framer-motion";

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
      // console.log(dataTable);

    }
  }, [data_Order]);

  const columns: TableProps<Order>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      render: (_: unknown, __: unknown, index: number) => {
        const stt =
          curentPages && pageSize
            ? (curentPages - 1) * pageSize + index + 1
            : "";
        return <b>{stt}</b>;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: Date) => (
        <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          {dayjs(value).format("DD/MM/YYYY")}
        </Tooltip>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 150,
      render: (value: number) => (
        <b className="text-blue-600">{value.toLocaleString()} ₫</b>
      ),
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      key: "payment",
      width: 150,
      render: (_: unknown, item: Order) => (
        <Tag
          color={
            item?.payment?.name === "Thanh toán khi nhận hàng"
              ? "blue"
              : "green"
          }
        >
          {item?.payment?.name === "Thanh toán khi nhận hàng" ? "COD" : "VNPay"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "status",
      key: "status",
      render: (_: unknown, item: Order) => {
        if (item.isPaid) {
          const statusColorMap: Record<string, string> = {
            "Hoàn thành": "green",
            "Chưa xác nhận": "yellow",
            "Đang giao": "purple",
            "Đã hủy": "red",
          };
          return (
            <Tag color={statusColorMap[item?.status] || "blue"}>
              {item?.status}
            </Tag>
          );
        }
        else {
          return (
            <Tag color={"red"}>
              Chưa thanh toán
            </Tag>
          )
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_: unknown, item: Order) => (
        <Link to={`/account/orders/${item._id}`}>
          <Button type="primary" icon={<EyeOutlined />}>
            Xem chi tiết
          </Button>
        </Link>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurentPages(page);
  };

  return (
    <div className="bg-white border border-gray-200/50 rounded-xl p-3 shadow-md">
      {/* transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] */}
      <Table
        rowKey="_id"
        bordered={false}
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        className="rounded-lg"
      />
      <Space className="mt-4 flex w-full justify-end">
        <Pagination
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          total={totalPages * pageSize}
          current={curentPages}
        />
      </Space>
    </div>
  );
}
