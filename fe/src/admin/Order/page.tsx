import { useEffect, useState } from "react";
import { Order } from "../../interface/Order";
import axios from "axios";
import {
  Button,
  Flex,
  Input,
  Pagination,
  Select,
  Skeleton,
  Table,
  TableProps,
  Tag,
  Form,
  Tooltip,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface searchKey {
  searchKey: string;
}
const AdminOrderPage = () => {
  const [dataTable, setDataTable] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [curentPages, setCurentPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const pageSize = 10;

  const url = `http://localhost:3000/api/orders?_embed=user,voucher,payment,itemsOrder,receiverInfo&_page=${curentPages}&_limit=${pageSize}&status=${filterStatus}`;
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
  const validTransitions = [
    "Chưa xác nhận",
    "Đã xác nhận",
    "Đang giao",
    "Hoàn thành",
    "Đã hủy",
  ];

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
        return (
          <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
            {dayjs(value).format("DD/MM/YYYY")}
          </Tooltip>
        );
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (_: unknown, item: Order) => {
        return (
          <div>
            <div>{item?.receiverInfo?.name?.toString()}</div>
            <div>{item?.receiverInfo?.phone?.toString()}</div>
            <div>{item?.receiverInfo?.address?.toString()}</div>
          </div>
        );
      },
    },

    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 150,
      render: (_: unknown, item: Order) => {
        return <>{Number(item?.total).toLocaleString("vi-VN")} VNĐ</>;
      },
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
            <Link to={`/admin/order/${item._id}`}>
              <Button type="primary">Xem chi tiết</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  // search
  // Filter
  // Hàm fetch API
  const fetchOrder = async (key: string) => {
    setFilterStatus(key);
    const res = await fetch(
      `http://localhost:3000/api/orders?_embed=user,voucher,payment,itemsOrder&_page=${curentPages}&_limit=${pageSize}&status=${key}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Error fetching orders");
    }
    return res.json(); // Trả về dữ liệu từ API
  };
  const handleChangeSelect = async (value: string) => {
    const encodedStatus = encodeURIComponent(value);

    const newData = await fetchOrder(encodedStatus);
    setDataTable(newData.orders);
    setCurentPages(newData.page);
    setTotalPages(newData.totalPages);
  };

  // Thay đổi trang
  const handlePageChange = (page: number) => {
    setCurentPages(page);
  };

  // filter
  const handleFinish = (values: searchKey) => {
    const searchKey = values.searchKey.trim();
    const dataFilter = dataTable.filter((item: Order) =>
      item._id.toString().toLowerCase().includes(searchKey)
    );
    setDataTable(dataFilter);
    setCurentPages(1);
    setTotalPages(1);
  };

  const [formSearch] = Form.useForm();

  const handleRefresh = async () => {
    formSearch.resetFields();
    const newData = await fetchOrder("");
    setDataTable(newData.orders);
    setCurentPages(newData.page);
    setTotalPages(newData.totalPages);
  };

  return (
    <div>
      <h1 className="mb-1.5 text-2xl font-medium">DANH MỤC ĐƠN HÀNG</h1>
      <Flex gap={0} style={{ marginBottom: "30px" }} justify="space-between">
        {/* filter theo id order  */}
        <Form
          form={formSearch}
          name="searchForm"
          layout="inline"
          onFinish={handleFinish}
        >
          <Tooltip title="Nhập id đơn hàng" placement="right">
            <Form.Item label={null} name="searchKey" style={{ width: "400px" }}>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Tooltip>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
          <Tooltip title="Làm mới" placement="rightBottom">
            <ReloadOutlined
              style={{ cursor: "pointer" }}
              onClick={handleRefresh}
            />
          </Tooltip>
        </Form>
        {/* Filter theo status  */}
        <Select
          style={{ width: 150 }}
          defaultValue={"Tất cả trạng thái"}
          onChange={handleChangeSelect}
        >
          <Select.Option value="">Tất cả trạng thái</Select.Option>
          {validTransitions?.map((item: string) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Flex>
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
          onChange={handlePageChange}
          style={{ marginTop: 20, textAlign: "center" }}
        ></Pagination>
      </Skeleton>
    </div>
  );
};

export default AdminOrderPage;
