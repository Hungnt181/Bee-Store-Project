import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css"; // Import file CSS
import { MailOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            try {
                await axios.post(`http://localhost:3000/api/forgot_password`, formData);
                return true;
            } catch (error: any) {
                if (error.response && error.response.data.message) {
                    throw new Error(error.response.data.message);
                } else {
                    throw new Error('Có lỗi xảy ra, vui lòng thử lại');
                }
            }
        },
        onSuccess: () => {
            message.success("Vui lòng vào hòm thư để đặt lại mật khẩu mới");
            navigate('/signin');
        },
        onError: (error) => {
            message.error(error.message);
        }
    });

    return (
        <div className="flex justify-center items-center w-full h-[70vh] bg-gray-100">
            <Form
                layout="vertical"
                onFinish={(formData) => mutate(formData)}
                className="w-[80vw] max-w-2xl shadow-md rounded-lg bg-white"
            >
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center">Đặt lại mật khẩu</h2>
                    <p className="text-center text-gray-600 mb-6 font-all ">
                        Chúng tôi sẽ gửi cho bạn email để xác nhận đặt lại mật khẩu
                    </p>

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
                        <Input
                            className="border-0 border-b border-black rounded-none input py-2 font-all"
                            placeholder="Email"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="submit-button w-full bg-blue-500 hover:bg-blue-600 py-4 rounded-md mt-4 font-all"
                        >
                            Lấy lại mật khẩu
                        </Button>
                    </Form.Item>

                    <div className="text-center mb-2 font-all">
                        <span className="text-gray-600 ">Bạn đã có tài khoản? </span>
                        <Link to="/signin" className="text-blue-500 hover:text-blue-700">
                            Đăng nhập
                        </Link>
                    </div>

                    <div className="text-center font-all">
                        <span className="text-gray-600">Bạn chưa có tài khoản? </span>
                        <Link to="/signup" className="text-blue-500 hover:text-blue-700">
                            Đăng ký
                        </Link>
                    </div>
                </div>

            </Form>
        </div>
    );
};

export default ForgotPassword;