import { Button, Flex, Form, Input, Modal, Select } from 'antd'
import React from 'react'
import { useCreateCategory } from '../queryHooks';
type AddProps = {
  open: boolean;
  onClose: () => void;
};

const ModalAddCate: React.FC<AddProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    onClose();
    form.resetFields()
  };
  const { mutate: createCategory } = useCreateCategory(handleCancel);

  return <Modal
    title="Thêm mới danh mục"
    open={open}
    onCancel={handleCancel}
    footer={null}
    maskClosable={false}>
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
}

export default ModalAddCate