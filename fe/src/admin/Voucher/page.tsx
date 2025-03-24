import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Table, TableProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

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
  updatedAt: Date
  status: Boolean;
}
const columns: TableProps<Voucher>['columns'] = [
  // {
  //     title: 'ID',
  //     dataIndex: '_id',
  //     key: '_id',
  // },
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Tên voucher',
    dataIndex: 'title',
    key: 'title',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Mã voucher',
    dataIndex: 'codeName',
    key: 'codeName',
  },
  {
    title: 'Giá trị giảm (%)',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Giá trị giảm tối đa (vnđ)',
    dataIndex: 'maxValue',
    key: 'maxValue',
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (text: Date) => text ? new Date(text).toLocaleString() : '',
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'endTime',
    key: 'endTime',
    render: (text: Date) => text ? new Date(text).toLocaleString() : '',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text: Date) => text ? new Date(text).toLocaleString() : '',
  },
  {
    title: 'Ngày sửa',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (text: Date) => text ? new Date(text).toLocaleString() : '',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (text: boolean) => (text ? 'Hoạt động' : 'Không hoạt động'),
  },
  {
    title: '#',
    key: 'action',
    render: (record: Voucher) => (
      <div>
        <button>Xóa</button>
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
    className: 'whitespace-nowrap',
  }),
}));

const VoucherPage: React.FC = () => {
  const [listVoucher, setListVoucher] = useState<Voucher[]>([]);



  useEffect(() => {
    (async () => {
      try {
        const response = (await axios.get(`http://localhost:3000/api/vouchers`)).data;
        console.log(response);
        // console.log(setListVoucher(response.data.data));
        let list = response.data.map((item: Voucher, index: number) => ({
          ...item, index: index + 1,
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
    emptyText: 'Không có dữ liệu',
  };

  return (
    <>
      <h1 className="text-3xl mb-5 font-semibold">DANH SÁCH MÃ GIẢM GIÁ</h1>
      <Flex gap={0} style={{ marginBottom: "30px" }} justify="space-between">
        <Button type="primary" href="/admin/voucher/add" icon={<PlusOutlined />}>Thêm mới</Button>
      </Flex>
      <Table<Voucher>
        columns={modifiedColumns}
        dataSource={listVoucher}
        rowKey="index"
        locale={locale} />
    </>
  )
};


export default VoucherPage;