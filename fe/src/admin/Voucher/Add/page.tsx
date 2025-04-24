
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Space,
    Typography
} from 'antd';
import { SaveOutlined, CloseOutlined, GiftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AxiosError } from 'axios';

import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Voucher } from '../../../interface/Voucher';

const { TextArea } = Input;
const { Title, Text } = Typography;

const VoucherAddPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate,isPending: isSubmitting  } = useMutation({
        mutationFn: async (formData: Voucher) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const payload = {
                ...formData,
                startTime: dayjs(formData.startTime).toISOString(),
                endTime: dayjs(formData.endTime).toISOString(),
            };
            const res = await axios.post("http://localhost:3000/api/vouchers", payload, config);
            return res.data;
        },
        onSuccess: () => {
            message.success({
                content: "Thêm voucher thành công",
                icon: <GiftOutlined style={{ color: '#52c41a' }} />
            });
            queryClient.invalidateQueries({ queryKey: ["vouchers"] });
            navigate("/admin/voucher");
        },
      onError: (error: AxiosError) => {
  const errorMsg =
    (error.response?.data as { message?: string })?.message || 'Lỗi khi thêm voucher';
  message.error(errorMsg);
  console.error('Mutation error:', error);
}
,
    });

    return (
        <Card 
            bordered={false}
            style={{ 
                borderRadius: 8,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.03)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <GiftOutlined style={{ fontSize: 24, marginRight: 12, color: '#1677ff' }} />
                <Title level={3} style={{ margin: 0 }}>THÊM MỚI VOUCHER</Title>
            </div>
            <Divider style={{ margin: '16px 0 24px' }} />

            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => mutate(values)}
                requiredMark="optional"
                scrollToFirstError
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Card 
                            title={<Text strong>Thông tin cơ bản</Text>} 
                            size="small" 
                            headStyle={{ backgroundColor: '#f5f5f5' }}
                            style={{ marginBottom: 24 }}
                        >
                            <Row gutter={16}>
                                <Col span={24} md={12}>
                                    <Form.Item 
                                        label="Tên voucher" 
                                        name="title" 
                                        rules={[{ required: true, message: "Vui lòng nhập tên voucher" }]}
                                        tooltip="Tên hiển thị của voucher cho người dùng"
                                    >
                                        <Input placeholder="Nhập tên voucher" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item 
                                        label="Mã voucher" 
                                        name="codeName" 
                                        rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
                                        tooltip="Mã voucher người dùng sẽ nhập để áp dụng giảm giá"
                                    >
                                        <Input 
                                            placeholder="Nhập mã voucher" 
                                            className="uppercase" 
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item 
                                        label="Mô tả" 
                                        name="description" 
                                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                                    >
                                        <TextArea 
                                            rows={3} 
                                            placeholder="Mô tả chi tiết về voucher và điều kiện áp dụng" 
                                            showCount 
                                            maxLength={500}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card 
                            title={<Text strong>Giá trị và số lượng</Text>} 
                            size="small" 
                            headStyle={{ backgroundColor: '#f5f5f5' }}
                            style={{ marginBottom: 24 }}
                        >
                            <Row gutter={16}>
                                <Col span={24} md={8}>
                                    <Form.Item 
                                        label="Giảm giá (%)" 
                                        name="value" 
                                        rules={[
                                            { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
                                            { type: 'number', min: 1, max: 100, message: 'Giá trị từ 1 đến 100%' }
                                        ]}
                                        tooltip="Phần trăm giảm giá khi áp dụng voucher"
                                    >
                                        <InputNumber 
                                            style={{ width: '100%' }} 
                                            min={1} 
                                            max={100}
                                            formatter={value => `${value}%`}
                                           parser={value => value.replace('%', '')}

                                            placeholder="Nhập phần trăm"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={8}>
                                    <Form.Item 
                                        label="Giảm tối đa (VNĐ)" 
                                        name="maxValue" 
                                        rules={[{ required: true, message: "Vui lòng nhập giá trị giảm tối đa" }]}
                                        tooltip="Giới hạn số tiền tối đa được giảm khi áp dụng voucher"
                                    >
                                        <InputNumber 
                                            style={{ width: '100%' }} 
                                            min={0}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value: string | undefined): number => {
  const cleaned = (value || '').replace(/\$\s?|(,*)/g, '');
  return Number(cleaned);
}}

                                            placeholder="Nhập số tiền"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={8}>
                                    <Form.Item 
                                        label="Số lượng" 
                                        name="quantity" 
                                        rules={[
                                            { required: true, message: "Vui lòng nhập số lượng voucher" },
                                            { type: 'number', min: 1, message: 'Số lượng tối thiểu là 1' }
                                        ]}
                                        tooltip="Tổng số voucher có thể sử dụng"
                                    >
                                        <InputNumber 
                                            style={{ width: '100%' }} 
                                            min={1}
                                            placeholder="Nhập số lượng"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card 
                            title={<Text strong>Thời gian hiệu lực</Text>} 
                            size="small" 
                            headStyle={{ backgroundColor: '#f5f5f5' }}
                            style={{ marginBottom: 24 }}
                        >
                            <Row gutter={16}>
                                <Col span={24} md={12}>
                                    <Form.Item
                                        label="Thời gian bắt đầu"
                                        name="startTime"
                                        rules={[
                                            { required: true, message: "Vui lòng chọn thời gian bắt đầu" },
                                            {
                                                validator: (_, value) => {
                                                    const end = form.getFieldValue("endTime");
                                                    if (!value || !end || value.isBefore(end)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject("Thời gian bắt đầu phải trước thời gian kết thúc");
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker 
                                            showTime 
                                            format="DD-MM-YYYY HH:mm" 
                                            style={{ width: '100%' }} 
                                            placeholder="Chọn thời gian bắt đầu"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item
                                        label="Thời gian kết thúc"
                                        name="endTime"
                                        rules={[
                                            { required: true, message: "Vui lòng chọn thời gian kết thúc" },
                                            {
                                                validator: (_, value) => {
                                                    const start = form.getFieldValue("startTime");
                                                    if (!value || !start || value.isAfter(start)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject("Thời gian kết thúc phải sau thời gian bắt đầu");
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker 
                                            showTime 
                                            format="DD-MM-YYYY HH:mm" 
                                            style={{ width: '100%' }} 
                                            placeholder="Chọn thời gian kết thúc"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <Divider style={{ margin: '8px 0 24px' }} />

                <Form.Item style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button 
                                icon={<CloseOutlined />} 
                                onClick={() => navigate("/admin/voucher")}
                            >
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={isSubmitting}
                                icon={<SaveOutlined />}
                            >
                                Tạo voucher
                            </Button>
                        </Space>
                    </div>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default VoucherAddPage;