import { Space, Table, TableProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface Voucher {
    id: String;
    title: String;
    codeName: String;
    value: number;
    quantity: Number;
    description: String;
    startTime: Date;
    endTime: Date;
    status: Boolean;
}
const columns: TableProps<Voucher>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
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
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: boolean) => (text ? 'Active' : 'Inactive'),
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <div>
                <button>Xóa</button>
                <button>Sửa </button>
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
                const response = await axios.get<Voucher[]>(`http://localhost:3000/api/vouchers`);
                setListVoucher(response.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [listVoucher]);

    return (
        <Table<Voucher> columns={columns} dataSource={listVoucher} />
    )
};


export default VoucherPage;