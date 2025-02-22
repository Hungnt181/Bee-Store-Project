import { MoreOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Popconfirm, Popover, Skeleton, Space, Table, Tag } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import User from '../../../interface/User';
import useUpdate from '../../hooks/useUpdate.ts';
import AdminAccountAdd from './Add/page.tsx';
import { useState } from 'react';

const AdminAccountPage = () => {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["ADMINACCOUNTS"],
        queryFn: async () => {
            const response = await axios.get('http://localhost:3000/api/admin_account');
            return response.data.data.map((item: any) => ({ key: item._id, ...item }));
        }
    })

    const urlUpdate = "http://localhost:3000/api/update_status_admin_account/";
    const { mutate } = useUpdate(urlUpdate, "ADMINACCOUNTS");

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

                            <Link to={`/admin/admin_account/${item._id}`}>
                                <Button type="primary">Sửa</Button>
                            </Link>
                        </Space>
                    </div >
                );
                return (
                    <Space>
                        <Popover content={content} title="Chức năng" trigger="click">
                            <Button>
                                <MoreOutlined />
                            </Button>
                        </Popover>
                    </Space>
                );
            },
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Skeleton loading={isLoading}>
                <Button
                    type="primary"
                    style={{ marginBottom: "4px" }}
                    onClick={showModal}
                >
                    Thêm mới tài khoản
                </Button>

                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={{ pageSize: 6 }}
                />

                <Modal
                    title="Thêm mới tài khoản "
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <AdminAccountAdd />
                </Modal>
            </Skeleton>
        </div>
    )
}

export default AdminAccountPage
