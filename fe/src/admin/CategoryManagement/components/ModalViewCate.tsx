import { Form, Input, Modal, Select } from 'antd'
import React, { useEffect } from 'react'
import useCateStore from '../stores';
import dayjs from 'dayjs';
type ViewProps = {
  open: boolean;
  onClose: () => void;
};

const ModalViewCate: React.FC<ViewProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    onClose();
    form.resetFields()
  };
  const { cateDetail } = useCateStore();

  useEffect(() => {
    if (cateDetail) {
      form.setFieldsValue({
        ...cateDetail,
        createdAt: dayjs(form.getFieldValue("createdAt")).format("DD/MM/YYYY HH:mm:ss"),
        updatedAt: dayjs(form.getFieldValue("updatedAt")).format("DD/MM/YYYY HH:mm:ss"),
      });
    }
  }, [form, cateDetail]);

  return <Modal
    title="Chi tiết danh mục"
    open={open}
    onCancel={handleCancel}
    maskClosable={false}>
    <Form
      form={form}
      labelAlign={"left"}
      colon={false}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ marginTop: "20px" }}
      disabled
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
      <Form.Item
        label="Ngày tạo"
        name="createdAt"
        labelAlign="left"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Ngày sửa cuối"
        name="updatedAt"
        labelAlign="left"
      >
        <Input />
      </Form.Item>
    </Form>
  </Modal>
}

export default ModalViewCate