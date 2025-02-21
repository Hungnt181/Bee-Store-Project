import { Button, Space, Table, TableProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface Voucher {
    _id: String;
    title: String;
    codeName: String;
    value: Number;
    quantity: Number;
    description: String;
    startTime: Date;
    endTime: Date;
    createdAt:Date;
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
        title: 'Index',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'Code Name',
        dataIndex: 'codeName',
        key: 'codeName',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (text: Date) => text.toLocaleString(),
    },
    {
        title: 'End Time',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (text: Date) => text.toLocaleString(),
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: Date) => text ? new Date(text).toLocaleString() : '',
    },
    {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text: Date) => text ? new Date(text).toLocaleString() : '',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: boolean) => (text ? 'Active' : 'Inactive'),
    },
    {
        title: 'Action',
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
            <Space className="flex justify-between">
                <h1>Danh sách mã giảm giá</h1>
                <Button type="primary" href="/admin/voucher/add">Thêm voucher</Button>
            </Space>
            <Table<Voucher>
                columns={columns}
                dataSource={listVoucher}
                rowKey="index"
                locale={locale} />
        </>
    )
};


export default VoucherPage;