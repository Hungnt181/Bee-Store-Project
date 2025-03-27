import { MoreOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Popconfirm, Popover, Skeleton, Space, Table, Tag } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import User from '../../../interface/User';
import useUpdate from '../../hooks/useUpdate.ts';
import "../../../assets/Css/Admin/User/page.css"
const UserAccountPage = () => {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["USERACCOUNTS"],
        queryFn: async () => {
            const response = await axios.get('http://localhost:3000/api/user_account');
            return response.data.data.map((item: any) => ({ key: item._id, ...item }));
        }
    })

    const urlUpdate = "http://localhost:3000/api/update_status_user_account/";
    const { mutate } = useUpdate(urlUpdate, "USERACCOUNTS");

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: any) => {
                return text ? (
                    <Tag color="green">Hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngừng hoạt động</Tag>
                );
            },
        },
        {
            title: 'Kích hoạt',
            dataIndex: 'isVerified',
            key: 'isVerified',
            render: (text: any) => {
                return text ? (
                    <Tag color="green">Đã kích hoạt</Tag>
                ) : (
                    <Tag color="red">Chưa kích hoạt</Tag>
                );
            },
        },
        {
            title: "Ngày sửa cuối",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (value: Date) => {
                return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
            },
        },
        {
            title: 'Action',
            dataIndex: 'email',
            key: 'email',
            render: (_: any, item: User) => {
                const content = (
                    <div>
                        <Space>
                            <Popconfirm
                                title="Update"
                                description="Bạn muốn cập nhật trạng thái không ?"
                                onConfirm={() => {
                                    mutate(item._id);
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                {item.status ?
                                    <Button
                                        style={{
                                            minWidth: "60px",
                                            background: "#fff1f0",
                                            color: "#cf1322",
                                            padding: "5px",
                                            borderColor: "#ffa39e"
                                        }} >
                                        Ngưng hoạt động
                                    </Button>
                                    : <Button
                                        style={{
                                            minWidth: "60px",
                                            background: "#f6ffed",
                                            color: "#389e0d",
                                            padding: "5px",
                                            borderColor: "#b7eb8f"
                                        }}>
                                        Hoạt động
                                    </Button>}
                            </Popconfirm>
                        </Space>
                    </div >
                );
                return (
                    <Space>
                        <Popover className='Chucnang' content={content} title="Cập nhật trạng thái" trigger="click">
                            <Button>
                                <MoreOutlined />
                            </Button>
                        </Popover>
                    </Space>
                );
            },
        }
    ];

    return (
        <div>
            <Table
                dataSource={data}
                columns={columns}
                pagination={{ pageSize: 6 }}
            />
        </div>
    )
}

export default UserAccountPage
