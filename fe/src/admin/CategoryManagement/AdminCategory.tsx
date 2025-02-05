import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Select, Skeleton, Space, Table, Tag } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Category } from '../../interface/Category';
import { TableProps } from 'antd/es/table';
import { EditOutlined, InfoOutlined, PlusOutlined } from '@ant-design/icons';

const AdminCategory: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {  
    setIsModalOpen(false);
    form.resetFields()
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
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
      width: 300,
    },
    {
      title: "Trạng thái danh mục",
      dataIndex: "status",
      key: "status",
      width: 600,
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
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: () => {
        return (
          <Space>
            <Button type={"default"} icon={<InfoOutlined />}>Chi tiết</Button>
            <Button type={"primary"} icon={<EditOutlined />}>Chỉnh sửa</Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {/* <Divider orientation="center">DANH MỤC LOẠI SẢN PHẨM</Divider> */}
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
            pagination={{ pageSize: 10 }}
          />
        </Skeleton>
      </Flex>
    </div>
  )
}

export default AdminCategory