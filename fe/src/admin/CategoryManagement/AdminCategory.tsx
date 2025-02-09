import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Dropdown, Flex, Form, Input, MenuProps, Modal, notification, Select, Skeleton, Space, Table, Tag, Tooltip } from 'antd';
import axios from 'axios';
import React, { useMemo, useState } from 'react';
import { Category } from '../../interface/Category';
import { TableProps } from 'antd/es/table';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// ------type for noti
import type { NotificationArgsProps } from 'antd';
type NotificationMessage = NotificationArgsProps['message'];
type NotificationType = 'success' | 'info' | 'warning' | 'error';
const Context = React.createContext({ name: 'Default' });

// ------main fc
const AdminCategory: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields()
  };

  // ------noti
  const [api, contextHolder] = notification.useNotification();
  const contextValue = useMemo(() => ({ name: 'Thêm mới danh mục sản phẩm' }), []);
  const openNotification = (type: NotificationType, result: NotificationMessage, ) => {
    api[type]({
      message: <span style={{textTransform: "uppercase", fontWeight: "bold" }}>{result}</span>,
      placement: "topRight",
      description: type === "success" ? `${contextValue["name"]} thành công!` : `${contextValue["name"]} thất bại`,
      showProgress: true,
      duration: 3
    });
  };

  // ------fetch
  const { data, isLoading } = useQuery({
    queryKey: ["GET_CATEGORIES"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/categories`);
        return data.data.map((item: Category) => ({
          key: item._id,
          ...item,
        }));
      } catch (error) {
        throw new Error(`Opps!!! ${error}`);
      }
    },
  });

  // ------post
  const { mutate: createCategory } = useMutation({
    mutationFn: async (newCategory: Category) => {
      try {
        await axios.post("http://localhost:3000/api/categories", newCategory);
      } catch (error) {
        throw new Error(`Opp!!! ${error}`);
      }
    },
    onSuccess: () => {
      openNotification('success', 'THÀNH CÔNG!');
      queryClient.invalidateQueries({
        queryKey: ["GET_CATEGORIES"],
      });
      handleCancel();
    },
    onError: () => {
      openNotification('error', 'THẤT BẠI!');
      handleCancel();
    }
  })

  const items: MenuProps['items'] = [
    {
      key: 'EDIT',
      label: (
        <a target="_blank" href="">
          Chỉnh sửa
        </a>
      ),
    },
    {
      key: 'DELETE',
      label: (
        <a target="_blank" href="">
          Xóa
        </a>
      ),
      disabled: true,
    },
  ];

  const columns: TableProps<Category>['columns'] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_value: unknown, _record: Category, index: number) => {
        return <div>{index + 1}</div>
      }
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (value: string) => {
        return <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip>
      }
    },
    {
      title: "Trạng thái danh mục",
      dataIndex: "status",
      key: "status",
      width: 250,
      render: (_status: boolean, item: Category) => {
        return item.status ? (
          <Tag color="green">
            Đang hoạt động
          </Tag>
        ) : (
          <Tag color="red">
            Dừng hoạt động
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (value: string) => {
        return <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      },
    },
    {
      title: "Ngày sửa cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      render: (value: string) => {
        return <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "right",
      fixed: 'right',
      render: () => {
        return (
          <Space>
            <Button type={"primary"}>Chi tiết</Button>
            <Dropdown menu={{ items }} placement="bottomLeft">
              <MoreOutlined style={{cursor: "pointer"}}/>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <h2>DANH MỤC LOẠI SẢN PHẨM</h2>
      <Flex vertical gap={20} >
        <Button type={"primary"} style={{ width: "100px" }} onClick={showModal} icon={<PlusOutlined />}>
          Thêm mới
        </Button>
        <Modal title="Thêm mới danh mục" open={isModalOpen} onCancel={handleCancel} footer={null} maskClosable={false}>
          <Form
            form={form}
            labelAlign={"left"}
            colon={false}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ marginTop: "20px" }}
            onFinish={createCategory}
          >
            <Form.Item
              label="Tên danh mục"
              name="name"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Nhập tên danh mục"
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Trạng thái danh mục"
              name="status"
              labelAlign="left"
              rules={[
                {
                  required: true,
                  message: "Chọn trạng thái danh mục"
                },
              ]}
            >
              <Select>
                <Select.Option value={true}>Đang hoạt động</Select.Option>
                <Select.Option value={false}>Dừng hoạt động</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label={null}>
              <Flex gap={20} justify='center'>
                <Button htmlType='submit' type='primary'>Thêm mới</Button>
                <Button type='primary' onClick={handleCancel}>Hủy bỏ</Button>
              </Flex>
            </Form.Item>
          </Form>
        </Modal>
        <Skeleton loading={isLoading}>
          <Table
            dataSource={data}
            columns={columns}
            rowKey={"id"}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content', y: 55 * 7 }}
          />
        </Skeleton>
      </Flex>
      </Context.Provider>
  )
}

export default AdminCategory