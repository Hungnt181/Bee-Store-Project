// import React, { useState } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
} from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            try {
                await axios.post("http://localhost:3000/api/vouchers", formData, config);
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
            message.success("Thêm thành công");
            queryClient.invalidateQueries({
                queryKey: ["vouchers"],
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
                encType="multipart/form-data"
                onFinish={(formData) => {
                    mutate(formData);
                }}
                onValuesChange={onValuesChange}
                layout="vertical"
                // disabled={componentDisabled}
                style={{ maxWidth: 600 }}

            >
                <Title level={3} style={{ margin: 0 }}>THÊM MỚI VOUCHER</Title>
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
                    <InputNumber style={{ width: '100%' }}/>
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
                    <InputNumber min="0" style={{ width: '100%' }}/>
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
                    <DatePicker showTime format="DD-MM-YYYY HH:mm" placeholder='' className='w-auto' style={{ width: '100%' }}/>
                </Form.Item>
                {/* <Form.Item label="Trạng thái (bật/tắt)"
                    name={'status'}
                    labelCol={{ className: 'w-auto text-left' }}>
                    <Switch />
                </Form.Item> */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">Tạo voucher mới</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default VoucherAddPage;