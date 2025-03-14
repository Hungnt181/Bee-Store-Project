import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../assets/Css/Website/Signup/style.css"; // Import file CSS

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

    return (
        <div className="login-container">

            <Form
                layout="vertical"
                onFinish={(formData) => mutate(formData)}
                className="login-form"
            >
                <div className="tabs">
                    <Button className="tab active">ĐĂNG NHẬP</Button>
                    <Button className="tab" onClick={() => navigate('/signup')}>ĐĂNG KÝ</Button>
                </div>
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
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" className="submit-button">
                        Đăng nhập
                    </Button>
                </Form.Item>
                <div className="text-center">
                    <a className="title1" href="/forgot">Quên mật khẩu</a>
                </div>
            </Form>
        </div>
    );
};

export default Signin;
