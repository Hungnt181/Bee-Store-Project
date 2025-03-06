import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css"; // Import file CSS

const Signup = () => {

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            try {
                await axios.post(`http://localhost:3000/api/signup_user`, formData);
            } catch (error: any) {
                if (error.response && error.response.data.message) {
                    throw new Error(error.response.data.message);
                } else {
                    throw new Error('Có lỗi xảy ra, vui lòng thử lại');
                }
            }
        },
        onSuccess: () => {
            message.success("Đăng ký thành công, Vui lòng vào hòm thư trong gmail để xác nhận tài khoản");
        },
        onError: (error) => {
            message.error(error.message);
        }
    });

    return (
        <div className="signup-container">
            <div className="tabs">
                <Button className="tab" onClick={() => navigate('/signin')}>ĐĂNG NHẬP</Button>
                <Button className="tab active">ĐĂNG KÝ</Button>
            </div>
            <Form
                layout="vertical"
                onFinish={(formData) => mutate(formData)}
                className="signup-form"
            >
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Không bỏ trống họ tên"
                        }
                    ]}
                >
                    <Input className="input" placeholder="Họ tên" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Không bỏ trống email"
                        },
                        {
                            type: 'email',
                            message: 'Không đúng định dạng email'
                        }
                    ]}
                >
                    <Input className="input" placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="tel"
                    rules={[
                        {
                            required: true,
                            message: "Không bỏ trống số điện thoại"
                        },
                        {
                            min: 8,
                            message: "Tối thiểu 8 chữ số"
                        },
                        {
                            max: 15,
                            message: "Tối đa 15 chữ số"
                        }
                    ]}
                >
                    <Input className="input" placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Không bỏ trống mật khẩu"
                        },
                        {
                            min: 6,
                            message: "Ít nhất 6 kí tự"
                        },
                        {
                            max: 25,
                            message: "Tối đa 25 kí tự"
                        }
                    ]}
                >
                    <Input.Password className="input" placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Nhập lại mật khẩu"
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Không trùng khớp mật khẩu'));
                            }
                        })
                    ]}
                >
                    <Input.Password className="input" placeholder="Nhập lại mật khẩu" />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" className="submit-button">
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Signup;
