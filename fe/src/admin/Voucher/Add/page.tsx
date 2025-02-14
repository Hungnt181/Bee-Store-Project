import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const VoucherAddPage = () => {
    //   const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

    return (
        <>
            {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                // disabled={componentDisabled}
                style={{ maxWidth: 600 }}
            >

                <Form.Item label="Tên voucher" name={"title"} labelCol={{ className: 'w-auto text-left' }}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mã voucher" name={"codeName"} labelCol={{ className: 'w-auto text-left' }}>
                    <Input className='uppercase'/>
                </Form.Item>
                <Form.Item label="Số lượng" labelCol={{ className: 'w-auto text-left' }}>
                    <InputNumber min="0" />
                </Form.Item>
                <Form.Item label="Mô tả" labelCol={{ className: 'w-auto text-left' }}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Thời gian diễn ra sự kiện" labelCol={{ className: 'w-auto text-left' }}>
                    <RangePicker />
                </Form.Item>
                <Form.Item label="Trạng thái (bật/tắt)" valuePropName="status" labelCol={{ className: 'w-auto text-left' }}>
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button type="primary">Submit</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default VoucherAddPage;