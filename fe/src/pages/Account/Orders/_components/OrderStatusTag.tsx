import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
export enum OrderStatus {
    pending = 'pending',
    cancelled = 'cancelled',
    confirmed = 'confirmed',
    shipping = 'shipping',
    delivered = 'delivered',
    done = 'done',
}
export const OrderStatusTag = ({ status }: { status: OrderStatus }) => {
    switch (status) {
        case OrderStatus.pending:
            return (
                <Tag icon={<ClockCircleOutlined />} color='default'>
                    Chờ xác nhận
                </Tag>
            );
        case OrderStatus.confirmed:
            return <Tag color='processing'>Đã xác nhận</Tag>;
        case OrderStatus.cancelled:
            return (
                <Tag icon={<CloseCircleOutlined />} color='error'>
                    Đã hủy
                </Tag>
            );
        case OrderStatus.shipping:
            return (
                <Tag icon={<ExclamationCircleOutlined />} color='warning'>
                    Đang giao
                </Tag>
            );
        case OrderStatus.delivered:
            return (
                <Tag icon={<ExclamationCircleOutlined />} color='purple'>
                    Đã giao
                </Tag>
            );
        case OrderStatus.done:
            return (
                <Tag icon={<CheckCircleOutlined />} color='success'>
                    Hoàn thành
                </Tag>
            );
        default:
            return (
                <Tag icon={<MinusCircleOutlined />} color='default'>
                    Có lỗi!!!
                </Tag>
            );
    }
};