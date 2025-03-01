import { useEffect, useState } from "react";
import { Order } from "../../interface/Order";
import axios from "axios";
import { Button, Pagination, Skeleton, Table, TableProps, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const AdminOrderPage = () => {
  const [dataTable, setDataTable] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [curentPages, setCurentPages] = useState(1);
  const pageSize = 10;

  const url = `http://localhost:3000/api/orders?_embed=user,voucher,payment,itemsOrder&_page=${curentPages}&_limit=${pageSize}`;
  const key = "dataPageOrder";

  const { data: data_Order, isLoading } = useQuery({
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

  //colums
  const columns: TableProps<Order>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => {
        const stt =
          curentPages && pageSize
            ? (curentPages - 1) * pageSize + index + 1
            : "";
        return stt;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: Date) => {
        return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (_: unknown, item: Order) => {
        return (
          <div>
            <div>{item?.user?.name}</div>
            <div>{item?.user?.address}</div>
            <div>{item?.user?.tel}</div>
          </div>
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
      render: (_: unknown, item: Order) => {
        return item?.payment?.name;
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
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_: unknown, item: Order) => {
        return (
          <div>
            <Link to={`/admin/order/${item._id}`}>
              <Button type="primary">Xem chi tiết</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ margin: "0 0 5px 0" }}>DANH MỤC ĐƠN HÀNG</h1>
      <Skeleton loading={isLoading}>
        <Table
          dataSource={dataTable}
          columns={columns}
          pagination={false}
          scroll={{ y: 55 * 8 }}
        />
        <Pagination
          current={curentPages}
          total={totalPages * pageSize}
          pageSize={pageSize}
          //   onChange={handlePageChange}
          style={{ marginTop: 20, textAlign: "center" }}
        ></Pagination>
      </Skeleton>
    </div>
  );
};

export default AdminOrderPage;
