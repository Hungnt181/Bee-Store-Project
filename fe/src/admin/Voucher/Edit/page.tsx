// import React, { useState } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Skeleton,
    Switch,
} from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { TextArea } = Input;

const VoucherEditPage = () => {
    //   const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { id } = useParams();
    // lấy dữ liệu để sửa
    const { data, isLoading } = useQuery({
        queryKey: ["VOUCHER", id],
        queryFn: async () => {
            const { data } = await axios.get(
                `http://localhost:3000/api/vouchers/${id}`
            );
            return data.data;
        },
    });
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                title: data.title,
                codeName: data.codeName,
                value: data.value,
                maxValue: data.maxValue,
                quantity: data.quantity,
                description: data.description,
                startTime: data.startTime ? dayjs(data.startTime) : null,
                endTime: data.endTime ? dayjs(data.endTime) : null,
                status: data.status,
            });
        }
    }, [data, form]);

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            try {
                await axios.put(`http://localhost:3000/api/vouchers/${id}`, formData, config);
                form.resetFields();
                navigate("/admin/voucher");
                console.log(formData);

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
            message.success("Cập nhật sản phẩm thành công");
        },
        onError: (error: any) => {
            console.error("Mutation error:", error);
        },
    });
    if (isLoading) return <Skeleton></Skeleton>;
    return (
        <>
            <Form
                form={form}
                encType="multipart/form-data"
                onFinish={(formData) => {
                    mutate(formData);
                }}
                layout="vertical"
                // disabled={componentDisabled}
                style={{ maxWidth: 600 }}
            >
                <Title level={2}>Sửa voucher</Title>

                <Divider className='border-transparent' />
                <Form.Item
                    label="Tên voucher"
                    name={"title"}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mã voucher"
                    name={"codeName"}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                    ]}
                >
                    <Input className='uppercase' />
                </Form.Item>
                <Form.Item
                    label="Giá trị phần trăm giảm (%)"
                    name={"value"}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                        {
                            type: 'number',
                            min: 0,
                            max: 100,
                            message: 'Giá trị phải nằm trong khoảng từ 0 đến 100!',
                        },
                    ]}

                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Giá trị tối đa giảm (vnđ)"
                    name={"maxValue"}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Số lượng"
                    name={'quantity'}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                        {
                            type: 'number',
                            min: 0,
                            message: 'Giá trị phải từ 0',
                        },
                    ]}
                >
                    <InputNumber min="0" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name={'description'}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                    ]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="Thời gian bắt đầu"
                    name={'startTime'}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                    ]}
                >
                    <DatePicker showTime format="DD-MM-YYYY HH:mm" placeholder='' className='w-auto' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Thời gian kết thúc"
                    name={'endTime'}
                    labelCol={{ className: 'w-auto text-left' }}
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống',
                        },
                    ]}
                >
                    <DatePicker showTime format="DD-MM-YYYY HH:mm" placeholder='' className='w-auto' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Trạng thái (bật/tắt)"
                    name={'status'}
                    labelCol={{ className: 'w-auto text-left' }}>
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Cập nhật</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default VoucherEditPage;