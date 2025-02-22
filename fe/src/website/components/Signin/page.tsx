import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css"; // Import file CSS

const Signin = () => {

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            await axios.post(`http://localhost:3000/api/signin_user`, formData);
        },
        onSuccess: () => {
            message.success("Đăng nhập thành công");
            navigate('/');
        },
        onError: () => {
            message.error("Đăng nhập thất bại, vui lòng thử lại");
        }
    });

    return (
        <div className="login-container">
            <div className="tabs">
                <Button className="tab active">ĐĂNG NHẬP</Button>
                <Button className="tab" onClick={() => navigate('/signup')}>ĐĂNG KÝ</Button>
            </div>
            <Form
                layout="vertical"
                onFinish={(formData) => mutate(formData)}
                className="login-form"
            >
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
                    <Input placeholder="Email" />
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
                    <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" className="submit-button">
                        Đăng nhập
                    </Button>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="link" htmlType="button" className="forgot-password-link">
                        Quên mật khẩu?
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Signin;
