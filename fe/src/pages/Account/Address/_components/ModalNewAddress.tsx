import { ConfigProvider, Form, FormProps, Input, Modal } from "antd";
import { ReactNode, useState } from "react";

export default function ModalNewAddress({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onFinish: FormProps["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Modal
        centered
        open={isOpen}
        footer={<></>}
        onCancel={handleClose}
        title={
          <h3 className="text-xl font-semibold uppercase">Thêm địa chỉ mới</h3>
        }
        onClose={handleClose}
      >
        <div className="py-4">
          <Form
            name="newAddress"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    hoverBorderColor: "#2e2e2e",
                    activeBorderColor: "#2e2e2e",
                    activeShadow: "none",
                    paddingInline: 18,
                  },
                },
                token: {
                  colorBorder: "#2e2e2e",
                  borderRadius: 3,
                  fontSize: 14,
                  colorText: "black",
                },
              }}
            >
              <Form.Item
                label={<span className="font-medium text-sm">Họ Và Tên</span>}
                name="userName"
              >
                <Input
                  placeholder="Nhập họ và tên của bạn"
                  className="h-[42px]"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-sm">Số điện thoại</span>
                }
                name="userName"
              >
                <Input
                  placeholder="Nhập số điện thoại của bạn"
                  className="h-[42px]"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-sm">Địa chỉ</span>}
                name="userName"
              >
                <Input
                  placeholder="Nhập địa chỉ của bạn"
                  className="h-[42px]"
                />
              </Form.Item>
            </ConfigProvider>

            <button
              type="submit"
              className="bg-[#110e11] hover:opacity-80 w-full duration-300 cursor-pointer font-semibold uppercase text-lg py-2 mt-4 px-12 text-white"
            >
              Xác nhận
            </button>
          </Form>
        </div>
      </Modal>
    </>
  );
}
