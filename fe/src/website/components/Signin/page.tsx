import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css"; // Import file CSS
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import beeImage from './anhong.png';

const Signin = () => {

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (formData) => {
            try {
                const response = await axios.post(`http://localhost:3000/api/signin_user`, formData);
                // console.log(response.data.data._id)
                localStorage.setItem('userRole', response.data.data.role)
                localStorage.setItem('nameUser', response.data.data.name)
                localStorage.setItem('idUser', response.data.data._id)
                // localStorage.setItem('dataUser', JSON.stringify(response.data.data))
                return response.data.data.role;
            } catch (error: any) {
                if (error.response && error.response.data.message) {
                    throw new Error(error.response.data.message);
                } else {
                    throw new Error('Có lỗi xảy ra, vui lòng thử lại');
                }
            }
        },
        onSuccess: (role) => {
            message.success("Đăng nhập thành công");
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        },
        onError: (error) => {
            message.error(error.message);
        }
    });

    const requestLoginGoogle = async (tokenGoogle: any) => {
        try {
            const res = await axios.post(`http://localhost:3000/api/login_google`, { tokenGoogle })
            return res.data
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Có lỗi xảy ra, vui lòng thử lại');
            }
        }
    }
    const handleSuccess = async (response: any) => {
        const { credential } = response;
        // console.log(credential);
        try {
            const res = await requestLoginGoogle(credential);
            message.success('Đăng nhập thành công')
            console.log(res)
            localStorage.setItem('idUser', res.user._id);
            localStorage.setItem('userRole', res.user.role);
            if (res.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

            return res.user.role;
        } catch (error: any) {
            // Hiển thị lỗi lên giao diện
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại');
            }
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-[70vh] bg-gray-100 ">
            <Form
                layout="vertical"
                onFinish={(formData) => mutate(formData)}
                className="w-[80vw] max-w-4xl shadow-md rounded-lg bg-white"
            >
                <div className="flex flex-col md:flex-row">
                    {/** LEFT  */}
                    <div className="w-full md:w-1/2 p-8 ">
                        <img
                            className="max-w-full h-auto"
                            src={beeImage}
                            alt="Sign in illustration"
                        />
                        <div className="text-center">
                            <Link to="/signup" className="text-gray-600 hover:text-gray-800 mt-2 font-all">
                                Bạn chưa có tài khoản? Đăng ký ngay
                            </Link>
                        </div>
                    </div>

                    {/** RIGHT  */}
                    <div className="w-full md:w-1/2 p-8">
                        <h2 className="text-3xl font-bold mb-8 text-center">Đăng nhập</h2>

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
                                prefix={<UserOutlined />}
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
                                className="border-0 border-b border-black rounded-none input py-2 mt-2 font-all"
                                placeholder="Mật khẩu"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="submit-button w-full h-auto bg-blue-500 hover:bg-blue-600 py-4 rounded-md mt-2 font-all"
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div className="text-center mb-2">
                            <Link to="/forgot" className="title1 text-blue-500 hover:text-blue-700 mt-2 font-all">
                                Quên mật khẩu
                            </Link>
                        </div>

                        <div className="text-center mb-2 mt-2">
                            <span> Hoặc </span>
                        </div>

                        <GoogleOAuthProvider clientId="418179027883-qmo12ptnf55u09goo2t0i2tf90o6rijd.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={handleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </GoogleOAuthProvider>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default Signin
