import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../helpers/utils";

interface Voucher {
  _id: String;
  title: String;
  codeName: String;
  value: Number;
  maxValue: Number;
  quantity: Number;
  description: String;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  status: Boolean;
}
const columns: TableProps<Voucher>["columns"] = [
  {
    title: "#",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Tên voucher",
    dataIndex: "title",
    key: "title",
    render: (text: string) => <a className="pointer-events-none">{text}</a>,
    width: 150
  },
  {
    title: "Mã voucher",
    dataIndex: "codeName",
    key: "codeName",
    width: 100
  },
  {
    title:<div className="text-wrap">Giảm (%)</div>,
    dataIndex: "value",
    key: "value",
    render: (text:number)=>(<span>{text}%</span>),
    width: 100
  },
  {
    title:<div className="text-wrap">Giảm tối đa (vnđ)</div>,
    dataIndex: "maxValue",
    key: "maxValue",
    render: (text:number)=>(<span>{formatCurrency(text, 'vnd')}</span>),
    width: 100
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    width: 300
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
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: Date) => (text ? new Date(text).toLocaleString() : ""),
  },
  {
    title: "Ngày sửa",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (text: Date) => (text ? new Date(text).toLocaleString() : ""),
    width: 150
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (text: boolean, record: Voucher) => {
      let textStatusVoucher= "";
      let color = 'blue'
      const currentTime = new Date();
      const startTime = new Date(record.startTime);
      const endTime = new Date(record.endTime);
      if (currentTime >= startTime && currentTime <= endTime) {
        text ? (textStatusVoucher="Đang hoạt động",color ='green') : (textStatusVoucher="Không hoạt động", color ='red');
      }
      else if (currentTime < startTime) {
        textStatusVoucher = "Chưa bắt đầu",
        color ='yellow'
      }
      else if (currentTime > endTime) {
        textStatusVoucher = "Đã kết thúc"
        color = 'grey'
      }
      return (
        <Tag color={color}>{textStatusVoucher}</Tag>
      )
    }
  },
  {
    title: "#",
    key: "action",
    render: (record: Voucher) => (
      <div>
        {/* <button>Xóa</button> */}
        <Button href={`/admin/voucher/${record._id}/edit`}>Sửa</Button>
      </div>
    ),
  },
];

// const listVoucher: Voucher[] = [
//     {
//         id: '1',
//         title: '111',
//         codeName: 'CODE123',
//         value: 100,
//         quantity: 10,
//         description: 'Discount Voucher',
//         startTime: new Date(),
//         endTime: new Date(),
//         status: true,
//     },
// ];

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
        const response = (await axios.get(`http://localhost:3000/api/vouchers`))
          .data;
        console.log(response);
        // console.log(setListVoucher(response.data.data));
        let list = response.data.map((item: Voucher, index: number) => ({
          ...item,
          index: index + 1,
          // createdAt: new Date(item.createdAt).toLocaleString(),
          // updatedAt: new Date(item.updatedAt).toLocaleString(),
        }));
        setListVoucher(list);
        // setListVoucher(response.data);
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
        <Button
          type="primary"
          href="/admin/voucher/add"
          icon={<PlusOutlined />}
        >
          Thêm mới
        </Button>
      </Flex>
      <Table<Voucher>
        columns={modifiedColumns}
        dataSource={listVoucher}
        rowKey="index"
        locale={locale}
      />
    </>
  );
};

export default VoucherPage;
