import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css"; // Import file CSS

const ResetPassword = () => {

    const { id } = useParams()

    console.log(id)
    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            await axios.post(`http://localhost:3000/api/update_password/${id}`, formData)
        },
        onSuccess: () => {
            message.success("Cập nhật mật khẩu thành công");
            navigate('/signin')
        }
    })


    return (
        <div className="signup-container">
            <div className="tabs">
                <span className="title">LẤY LẠI MẬT KHẨU</span>
            </div>
            <Form
                layout="vertical"
                onFinish={(formData) => mutate(formData)}
                className="signup-form"
            >
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
                        Đặt lại mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ResetPassword;
