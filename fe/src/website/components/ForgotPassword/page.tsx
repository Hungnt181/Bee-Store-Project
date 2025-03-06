import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css"; // Import file CSS

const ForgotPassword = () => {

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            await axios.post(`http://localhost:3000/api/forgot_password`, formData);
        },
        onSuccess: () => {
            message.success("Vui lòng vào hòm thư để đặt lại mật khẩu mới");
        },
        onError: () => {
            message.error("Đăng nhập thất bại, vui lòng thử lại");
        }
    });

    return (
        <div className="login-container">
            <div className="forgot">
                <span className=" text-2xl">ĐẶT LẠI MẬT KHẨU</span>
                <p>Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt lại mật khẩu.</p>
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
                    <Input className="input" placeholder="Email" />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" className="submit-button">
                        Lấy lại mật khẩu
                    </Button>
                </Form.Item>
                <div className="text-center">
                    <span className="title">Bạn đã có tài khoản ?</span>
                    <a className="title1" href="/signin">Đăng nhập</a>
                </div>
                <div className="text-center">
                    <span className="title">Bạn chưa có tài khoản ?</span>
                    <a className="title1" href="/signup">Đăng ký</a>
                </div>

            </Form>
        </div>
    );
};

export default ForgotPassword;
