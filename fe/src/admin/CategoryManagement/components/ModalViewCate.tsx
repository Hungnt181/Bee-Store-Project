import { Button, Flex, Form, Input, Modal, Select } from 'antd'
import React, { useEffect } from 'react'
import useCateStore from '../stores';
import { useUpdateCategory } from '../queryHooks';
import { useWatch } from 'antd/es/form/Form';
type ViewProps = {
  open: boolean;
  onClose: () => void;
};

const ModalViewCate: React.FC<ViewProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { cateDetail, isValuesChanged, setIsValuesChange } = useCateStore();
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const handleEdit = () => {
    setIsValuesChange(!isValuesChanged)
  }
  const watchName = useWatch("name", form);
  const watchStatus = useWatch("status", form);
  const data = {
    name: watchName,
    status: watchStatus
  }
  const { mutate: updateCategory } = useUpdateCategory(handleCancel, data, cateDetail._id || "");
  useEffect(() => {
    if (cateDetail) {
      form.setFieldsValue(cateDetail);
    }
  }, [form, cateDetail]);

  return <Modal
    title={(isValuesChanged === false) ? "Chi tiết danh mục" : "Chỉnh sửa danh mục"}
    onCancel={handleCancel}
    open={open}
    maskClosable={false}
    footer={null}
  >
    <Form
      form={form}
      labelAlign={"left"}
      colon={false}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ marginTop: "20px" }}
      onFinish={updateCategory}
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
        <Input disabled={isValuesChanged === false} />
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
        <Select disabled={isValuesChanged === false}>
          <Select.Option value={true}>Đang hoạt động</Select.Option>
          <Select.Option value={false}>Dừng hoạt động</Select.Option>
        </Select>
      </Form.Item>
      {(isValuesChanged === false) ? (<>
        <Form.Item
          label="Ngày tạo"
          name="createdAt"
          labelAlign="left"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Ngày sửa cuối"
          name="updatedAt"
          labelAlign="left"
        >
          <Input disabled />
        </Form.Item>
        <Flex justify='flex-end' style={{ marginRight: "32px" }}>
          <Form.Item label={null}>
            <Button onClick={handleCancel} type='default'>Đóng</Button>
          </Form.Item>
          <Form.Item label={null}>
            <Button onClick={handleEdit} type='primary'>Chỉnh sửa</Button>
          </Form.Item>
        </Flex>
      </>) : (<>
        <Flex justify='flex-end' style={{ marginRight: "32px" }}>
          <Form.Item label={null}>
            <Button onClick={onClose} type='default'>Hủy bỏ</Button>
          </Form.Item>
          <Form.Item label={null}>
            <Button type='primary' htmlType='submit'>Chỉnh sửa</Button>
          </Form.Item>
        </Flex>
      </>)}
    </Form>
  </Modal>
}

export default ModalViewCate