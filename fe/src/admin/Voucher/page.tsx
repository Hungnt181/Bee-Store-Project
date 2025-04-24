
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../helpers/utils";
import { Voucher } from "../../interface/Voucher";
import { Link } from "react-router-dom"; // 👈 Thêm dòng này

const columns: TableProps<Voucher>["columns"] = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Tên voucher",
    dataIndex: "title",
    key: "title",
    render: (text: string) => <span className="pointer-events-none">{text}</span>, 
    width: 150,
  },
  {
    title: "Mã voucher",
    dataIndex: "codeName",
    key: "codeName",
    width: 100,
  },
  {
    title: <div className="text-wrap">Giảm (%)</div>,
    dataIndex: "value",
    key: "value",
    render: (text: number) => <span>{text}%</span>,
    width: 100,
  },
  {
    title: <div className="text-wrap">Giảm tối đa (vnđ)</div>,
    dataIndex: "maxValue",
    key: "maxValue",
    render: (text: number) => <span>{formatCurrency(text, "vnd")}</span>,
    width: 100,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Ngày bắt đầu",
    dataIndex: "startTime",
    key: "startTime",
    render: (text: Date) => (text ? new Date(text).toLocaleString() : ""),
  },
  {
    title: "Ngày kết thúc",
    dataIndex: "endTime",
    key: "endTime",
    render: (text: Date) => (text ? new Date(text).toLocaleString() : ""),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (text: boolean, record: Voucher) => {
      let textStatusVoucher = "";
      let color = "";
      const currentTime = new Date();
      const startTime = new Date(record.startTime);
      const endTime = new Date(record.endTime);
    if (currentTime >= startTime && currentTime <= endTime) {
  if (text) {
    textStatusVoucher = "Đang hoạt động";
    color = "green";
  } else {
    textStatusVoucher = "Không hoạt động";
    color = "red";
  }
} else if (currentTime < startTime) {
  textStatusVoucher = "Chưa bắt đầu";
  color = "yellow";
} else if (currentTime > endTime) {
  textStatusVoucher = "Đã kết thúc";
  color = "grey";
}
      return <Tag color={color}>{textStatusVoucher}</Tag>;
    },
  },
  {
    title: "Thao tác",
    key: "action",
    render: (record: Voucher) => (
      <Flex gap="small">
        <Link to={`/admin/voucher/${record._id}`}>
          <Button type="default">Chi tiết</Button>
        </Link>
        <Link to={`/admin/voucher/${record._id}/edit`}>
          <Button type="primary">Sửa</Button>
        </Link>
      </Flex>
    ),
  },
];

const modifiedColumns = columns.map((column) => ({
  ...column,
  onHeaderCell: () => ({
    className: "whitespace-nowrap",
  }),
}));

const VoucherPage: React.FC = () => {
  const [listVoucher, setListVoucher] = useState<Voucher[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = (
          await axios.get(`http://localhost:3000/api/vouchers`)
        ).data;

        const list = response.data.map((item: Voucher, index: number) => ({
          ...item,
          index: index + 1,
        }));
        setListVoucher(list);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const locale = {
    emptyText: "Không có dữ liệu",
  };

  return (
    <>
      <h1 className="text-3xl mb-5 font-semibold">DANH SÁCH MÃ GIẢM GIÁ</h1>
      <Flex gap={0} style={{ marginBottom: "30px" }} justify="space-between">
        <Link to="/admin/voucher/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm mới
          </Button>
        </Link>
      </Flex>
      <Table<Voucher>
        columns={modifiedColumns}
        dataSource={listVoucher}
        rowKey="_id"
        locale={locale}
      />
    </>
  );
};

export default VoucherPage;
