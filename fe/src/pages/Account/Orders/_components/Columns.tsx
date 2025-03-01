/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ConfigProvider } from "antd";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { OrderStatusTag } from "./OrderStatusTag";

export interface DataType {
  _id: string;
  paymentMethod: 'Online' | 'COD';
  orderStatus: string;
  totalPrice: number;
  createdAt: string;
}


export const orderColumns = (): TableProps<DataType>["columns"] => {
  return [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      title: "Hình thức TT",
      dataIndex: "paymentMethod",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      title: "Tổng giá trị",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => <span className="whitespace-nowrap">{value} VNĐ</span>,
    },
    {
      title: "Trạng thái",
      key: "orderStatus",
      dataIndex: "orderStatus",
      render: (value) => <OrderStatusTag status={value} />,
    },
    {
      title: "Ngày đặt",
      key: "createdAt",
      dataIndex: "createdAt",
      sorter: (a: any, b: any) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (value) => (
        <span className="whitespace-nowrap">{dayjs(value).format("DD/MM/YYYY | hh:mm")}</span>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Link to={`/account/orders/${record._id}`}>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    defaultBg: "white",
                    defaultColor: "black",
                    defaultBorderColor: 'black',
                    defaultHoverBg: 'black',
                    defaultHoverBorderColor: "black",
                    defaultHoverColor: "white",
                  },
                },
              }}
            >
              <Button className="mr-2">Xem chi tiết</Button>
            </ConfigProvider>
          </Link>
        </>
      ),
    },
  ];
};
