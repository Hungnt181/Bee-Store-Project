import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"
import "../../../assets/Css/Website/Signup/style.css"; // Sử dụng cùng file CSS với trang đăng nhập
import { LockOutlined, UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import beeImage from './anhong.png'; // Sử dụng cùng hình ảnh

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
        <div className="flex justify-center items-center w-full h-auto py-10 bg-gray-100">
            <Form
                layout="vertical"
                onFinish={(formData) => mutate(formData)}
                className="w-[80vw] max-w-4xl shadow-md rounded-lg bg-white"
            >
                <div className="flex flex-col md:flex-row">


                    {/* Cột bên phải chứa biểu mẫu */}
                    <div className="w-full md:w-1/2 p-8">
                        <h2 className="text-3xl font-bold mb-6 text-center">Đăng ký</h2>

                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Không bỏ trống họ tên"
                                }
                            ]}
                        >
                            <Input
                                className="border-0 border-b border-black rounded-none input py-2 mb-2 font-all"
                                placeholder="Họ tên"
                                prefix={<UserOutlined className="mr-2" />}
                            />
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
                            <Input
                                className="border-0 border-b border-black rounded-none input py-2 mb-2 font-all"
                                placeholder="Email"
                                prefix={<MailOutlined className="mr-2" />}
                            />
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
                            <Input
                                className="border-0 border-b border-black rounded-none input py-2 mb-2 font-all"
                                placeholder="Số điện thoại"
                                prefix={<PhoneOutlined className="mr-2" />}
                            />
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
                            <Input.Password
                                className="border-0 border-b border-black rounded-none input py-2 mb-2 font-all"
                                placeholder="Mật khẩu"
                                prefix={<LockOutlined className="mr-2" />}
                            />
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
                            <Input.Password
                                className="border-0 border-b border-black rounded-none input py-2 mb-2 font-all"
                                placeholder="Nhập lại mật khẩu"
                                prefix={<LockOutlined className="mr-2" />}
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }} className="mt-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="submit-button w-full bg-blue-500 hover:bg-blue-600 py-4 rounded-md font-all"
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div className="text-center mb-2">
                            <Link to="/forgot" className="title1 text-blue-500 hover:text-blue-700 mt-2 font-all">
                                Quên mật khẩu
                            </Link>
                        </div>



                    </div>
                    {/* Cột bên trái chứa hình ảnh minh họa */}
                    <div className="w-full md:w-1/2 p-8">
                        <img
                            className="max-w-full h-auto"
                            src={beeImage}
                            alt="Sign up illustration"
                        />
                        <div className="flex flex-col items-center mt-4 font-all">
                            <Link to="/signin" className="text-gray-600 hover:text-gray-800">
                                Bạn đã có tài khoản? Đăng nhập ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default Signup;