// import React, { useState } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Switch,
} from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const VoucherAddPage = () => {
    //   const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);

    const onValuesChange = () => {
        setIsFormValid(form.isFieldsTouched(true) && !form.getFieldsError().filter(({ errors }) => errors.length).length);
    };
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            try {
                await axios.post("http://localhost:3000/api/vouchers", formData);
                form.resetFields();
                navigate("/admin/voucher");
            } catch (error: any) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    message.error(`Error creating: ${error.response.data.message}`);
                } else {
                    message.error("Error creating");
                }
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            message.success("Thêm thành công");
            queryClient.invalidateQueries({
                queryKey: ["variants"],
            });
        },
        onError: (error: any) => {
            console.error("Mutation error:", error);
        },
    });
    return (
        <>
            <Form
                form={form}
                onFinish={(formData) => {
                    mutate(formData);
                }}
                onValuesChange={onValuesChange}
                layout="horizontal"
                // disabled={componentDisabled}
                style={{ maxWidth: 600 }}
            >
                <Title level={2}>Thêm voucher</Title>

                <Form.Item label="Tên voucher" name={"title"} labelCol={{ className: 'w-auto text-left' }}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mã voucher" name={"codeName"} labelCol={{ className: 'w-auto text-left' }}>
                    <Input className='uppercase' />
                </Form.Item>
                <Form.Item label="Giá trị (số tiền giảm)" name={"valueVoucher"} labelCol={{ className: 'w-auto text-left' }}>
                    <Input />
                </Form.Item>
                <Form.Item label="Số lượng" name={'quantity'} labelCol={{ className: 'w-auto text-left' }}>
                    <InputNumber min="0" />
                </Form.Item>
                <Form.Item label="Mô tả" name={'description'} labelCol={{ className: 'w-auto text-left' }}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Thời gian diễn ra sự kiện" name={'timeVoucher'} labelCol={{ className: 'w-auto text-left' }}>
                    <RangePicker showTime format="DD-MM-YYYY HH:mm" className='w-auto' />
                </Form.Item>
                <Form.Item label="Trạng thái (bật/tắt)"
                    name={'status'}
                    labelCol={{ className: 'w-auto text-left' }}>
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={!isFormValid}>Submit</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default VoucherAddPage;