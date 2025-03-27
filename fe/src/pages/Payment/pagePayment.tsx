import { useEffect, useState, useCallback } from "react";
import { User, Phone, Mail, MapPin, Pencil, Tag, Lock } from "lucide-react";
import axios from "axios";
import {
  message,
  Input,
  Radio,
  Checkbox,
  Button,
  Select,
  Card,
  Divider,
  Typography,
  Space,
  Row,
  Col,
  Image,
  Form,
  notification,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface CartItemDetail {
  idProduct: string;
  idVariant: string;
  color: string;
  size: string;
  quantity: number;
}

interface ItemOrder {
  name: string;
  quantity: number;
  id_variant: string;
  uniqueId?: string; // Thêm một trường để tạo định danh duy nhất
}

interface ItemCheckout {
  idProduct: string;
  nameProduct: string;
  imgVariant: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  totalPrice: number;
}

interface VoucherItem {
  _id: string;
  title: string;
  codeName: string;
  value: number;
  quantity: number;
}

interface FormValues {
  customerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  note: string;
  agreement: boolean;
  paymentMethod: string;
  voucher: string;
}

const PaymentPage = () => {
  const nav = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const [selectedPayment, setSelectedPayment] = useState<string>(
    "67bfce96db17315614fced6f"
  ); // Mặc định chọn "cod"

  // Lấy thông tin tài khoản nếu có
  const id = localStorage.getItem("idUser");

  // Fetch user data từ API
  const { data: userDataApi } = useQuery({
    queryKey: ["USER_INFO", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/user_account/${id}`
      );
      return data.data;
    },
    enabled: !!id, // Chỉ chạy khi có ID
  });

  const [cartItems, setCartItems] = useState<CartItemDetail[]>([]);
  const [storedCartItems, setStoredCartItems] = useState<CartItemDetail[]>([]);
  const [itemOrder, setItemOrder] = useState<ItemOrder[]>([]);
  const [listCheckout, setListCheckout] = useState<ItemCheckout[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Tiền thanh toán
  const [paymentPrice, setPaymentPrice] = useState<number>(0);

  // Voucher
  const [voucherList, setVoucherList] = useState<VoucherItem[]>([]);
  const [promotionValue, setPromotionValue] = useState<number>(0);
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);
  const [idSelectedVoucher, setIdSelectedVoucher] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [userInForm, setUserInForm] = useState<string | null>(null);

  // Lấy cartItems từ localStorage
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    const storedPayCartItems = localStorage.getItem("selectedItemArray");
    if (storedPayCartItems && storedCartItems) {
      setCartItems(JSON.parse(storedPayCartItems));
      setStoredCartItems(JSON.parse(storedCartItems));
    }
    else {
      message.error("Không có sản phẩm để thanh toán", 3);
      nav('/')
    }

    // Lấy list voucher
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/vouchers");
        setVoucherList(data.data);
      } catch (error) {
        console.log("Không lấy được danh sách voucher: " + error);
      }
    })();
  }, []);

  // Lấy sản phẩm từ id
  const getPdts = async (idProduct: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/" + idProduct
      );
      return data.data;
    } catch (error) {
      console.log("Không lấy được sản phẩm từ id: " + error);
    }
  };

  // Lấy variant từ id
  const getVariant = async (idVariant: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/variants/" + idVariant
      );
      return data.variants[0];
    } catch (error) {
      console.log("Không lấy được biến thể từ id: " + error);
    }
  };

  // Tạo item cho listCheckout
  const fetchProducts = useCallback(async () => {
    try {
      const productPromises = cartItems.map((item) => getPdts(item.idProduct));
      const variantPromises = cartItems.map((item) =>
        getVariant(item.idVariant)
      );

      const products = await Promise.all(productPromises);
      const variants = await Promise.all(variantPromises);

      const updatedListCheckout: ItemCheckout[] = [];
      const updatedListItemOrder: ItemOrder[] = [];

      cartItems.forEach((cartItem, index) => {
        const productData = products[index];
        const variantData = variants[index];

        if (productData && variantData) {
          updatedListCheckout.push({
            idProduct: cartItem.idProduct,
            nameProduct: productData.name,
            imgVariant: variantData.image?.[0] || "",
            price: productData.price,
            color: cartItem.color,
            size: cartItem.size,
            quantity: cartItem.quantity,
            totalPrice: productData.price * cartItem.quantity,
          });

          // Thêm trường uniqueId để đảm bảo tính duy nhất của mỗi item
          updatedListItemOrder.push({
            name: `${productData.name}_${cartItem.color}_${cartItem.size}`,
            quantity: cartItem.quantity,
            id_variant: cartItem.idVariant,
            uniqueId: `${cartItem.idVariant}_${Date.now()}_${Math.floor(
              Math.random() * 1000
            )}`,
          });
        }
      });

      setListCheckout(updatedListCheckout);
      setItemOrder(updatedListItemOrder);
      calculateTotalPrice(updatedListCheckout);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [cartItems]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Tính tổng giá tiền
  const calculateTotalPrice = (items: ItemCheckout[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalPrice(total);
    setPaymentPrice(total);
  };

  // Lấy giá trị voucher từ select
  const handleSelectChange = (value: string, option: any) => {
    const selectedValue = Number(value);
    const selectedId = option?.["data-id"] || null;
    setSelectedVoucher(selectedValue);
    setIdSelectedVoucher(selectedId);
  };
  // const fetchVoucher (idSelectedVoucher)

  // lấy voucher tu id
  const getVoucher = async (idVoucher: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/vouchers/" + idVoucher
      );
      return data.data;
    } catch (error) {
      console.log("ko lấy đc bien the từ id" + error);
    }
  };

  //onclick event
  const getPromotionValue = async () => {
    if (selectedVoucher !== null && idSelectedVoucher) {
      const voucher = await getVoucher(idSelectedVoucher);
      let discount = (totalPrice / 100) * voucher.value;
      discount = discount > voucher.maxValue ? voucher.maxValue : discount;

      setPromotionValue(discount);
      setPaymentPrice(totalPrice - discount);
    }
  };

  // Nếu có tài khoản thì tự render vào
  useEffect(() => {
    if (userDataApi) {
      form.setFieldsValue({
        customerName: userDataApi.name,
        phoneNumber: userDataApi.tel,
        email: userDataApi.email,
        address: userDataApi.address,
      });
      setUserInForm(userDataApi._id);
    }
  }, [userDataApi, form]);

  // Hàm mới để log toàn bộ form values
  const handleFormSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      console.log("Form values:", values);

      // Có thể thực hiện xử lý sau khi log form
      handleSubmitOrder();
    } catch (error) {
      // console.error("Validation failed:", error);
      if (error instanceof Error) {
        message.error(
          error.message || "Vui lòng điền đầy đủ thông tin bắt buộc"
        );
      } else {
        message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }
    }
  };

  // Handle Submit Order
  const handleSubmitOrder = async () => {
    try {
      const values = form.getFieldsValue();

      setLoading(true);
      let receiverId = "";
      let itemOrderIds: string[] = [];

      // Api tạo thông tin người nhận
      try {
        const receiverInfo = await fetch(
          `http://localhost:3000/api/receivers`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: values.customerName,
              phone: values.phoneNumber,
              address: values.address,
            }),
          }
        );
        const receiverData = await receiverInfo.json();
        if (!receiverInfo.ok) {
          message.error(
            receiverData.message || "Tạo thông tin người nhận thất bại"
          );
          return;
        }
        receiverId = receiverData.data._id;
      } catch (error) {
        if (error instanceof Error) {
          message.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } else {
          message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
        return;
      }

      // Api tạo item order - Đã sửa để giải quyết lỗi duplicate key
      try {
        // Xử lý từng item riêng biệt để tránh lỗi duplicate key
        const itemOrderPromises = itemOrder.map(async (item: ItemOrder) => {
          const response = await fetch(`http://localhost:3000/api/itemOrder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([
              {
                name: item.name,
                quantity: item.quantity,
                id_variant: item.id_variant,
                uniqueId: item.uniqueId, // Thêm uniqueId nếu backend hỗ trợ
              },
            ]),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Tạo item order thất bại");
          }

          const data = await response.json();
          return data.data[0]._id;
        });

        itemOrderIds = await Promise.all(itemOrderPromises);
      } catch (error) {
        if (error instanceof Error) {
          message.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } else {
          message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
        return;
      }

      // Api tạo order
      try {
        const newOrder = await fetch(`http://localhost:3000/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total: paymentPrice,
            shippingFee: 0,
            isPaid:
              selectedPayment === "67bfce96db17315614fced6f" ? false : true,
            voucher: idSelectedVoucher === "" ? null : idSelectedVoucher,
            user: userInForm,
            payment: selectedPayment,
            receiverInfo: receiverId,
            itemsOrder: itemOrderIds,
            status: "Chưa xác nhận",
          }),
        });

        const orderData = await newOrder.json();
        if (!newOrder.ok) {
          throw new Error(orderData.message || "Tạo đơn hàng thất bại");
        }
        //loại bỏ các sản phẩm đã thanh toán
        const listItemAfterPay = storedCartItems.filter(
          //lọc storedCartItems theo các item có idVariant giống nhau
          (itemFromStored: CartItemDetail) =>
            !cartItems.some(itemFromCart =>
              itemFromCart.idVariant == itemFromStored.idVariant
            )
        );
        //storedCartItems - Tất cả sản phẩm trong cart
        //cartItems - Tất cả sản phẩm để thanh toán
        console.log(cartItems);
        console.log(listItemAfterPay);
        //cập nhật lại cart sau khi thanh toán
        localStorage.setItem("cartItems", JSON.stringify(listItemAfterPay));
        localStorage.removeItem("selectedItemArray");
        //clear cart items
        setCartItems([]);
        // localStorage.removeItem("cartItems");
        setListCheckout([]);
        setPaymentPrice(0);
        setSelectedVoucher(null);
        setPromotionValue(0);

        nav("/notify2");
      } catch (error) {
        if (error instanceof Error) {
          message.error(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } else {
          message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        message.error(err.message || "Vui lòng điền đầy đủ thông tin bắt buộc");
      } else {
        message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-7xl">
        {/* Thông tin sản phẩm */}
        <Title
          level={2}
          className="mb-4 pb-2 border-b border-gray-300"
          style={{ fontSize: "28px" }}
        >
          Thông tin sản phẩm
        </Title>

        <Card className="mb-6 bg-gray-50">
          {listCheckout.map((item: ItemCheckout, index: number) => (
            <div
              key={index}
              className={`flex gap-4 mb-4 pb-4 ${index !== listCheckout.length - 1
                ? "border-b border-gray-300"
                : ""
                }`}
            >
              <Image
                src={item.imgVariant}
                alt={item.nameProduct}
                width={96}
                height={96}
                className="object-cover rounded-lg"
                preview={false}
              />
              <div className="flex-1">
                <Text strong>
                  {" "}
                  <Link to={`/products/${item.idProduct}`}>
                    <span className="text-black">{item.nameProduct}</span>
                  </Link>{" "}
                </Text>
                <Text type="secondary" className="flex items-end">
                  Màu:
                  <div className="h-[20px] w-[20px] ml-2" style={{background: item.color}}/>
                </Text>
                <Text type="secondary" className="">
                 Size: 
                 <span className="font-bold text-black text-[16px] ml-1">{item.size}</span>
                </Text>
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg">
                    <span className="text-[18px]">{item.price}</span> vnđ
                  </Text>
                  <div className="flex items-center gap-2">
                    <Text>x {item.quantity}</Text>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Form thông tin người nhận */}
        <Form form={form} layout="vertical" requiredMark={false}>
          <Title
            level={2}
            className="mb-4 pb-2 border-b border-gray-300"
            style={{ fontSize: "28px" }}
          >
            Người nhận
          </Title>

          <Form.Item
            name="customerName"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng!" },
            ]}
          >
            <Input
              prefix={<User className="text-gray-500 w-5 h-5" />}
              placeholder="Tên khách hàng"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<Phone className="text-gray-500 w-5 h-5" />}
              placeholder="Số điện thoại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<Mail className="text-gray-500 w-5 h-5" />}
              placeholder="Địa chỉ email (không bắt buộc)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ nhận hàng!" },
            ]}
          >
            <Input
              prefix={<MapPin className="text-gray-500 w-5 h-5" />}
              placeholder="Nhập địa chỉ cụ thể"
              size="large"
            />
          </Form.Item>

          <Form.Item name="note">
            <Input
              prefix={<Pencil className="text-gray-500 w-5 h-5" />}
              placeholder="Nhập ghi chú (không bắt buộc)"
              size="large"
            />
          </Form.Item>

          {/* Phương thức thanh toán */}
          <div className="mb-6">
            <Title level={2} style={{ fontSize: "28px" }}>
              Phương thức thanh toán
            </Title>
            <Paragraph
              type="secondary"
              className="mb-4 pb-2 border-b border-gray-300"
            >
              Lựa chọn phương thức thanh toán phù hợp nhất cho bạn
            </Paragraph>

            <Form.Item name="paymentMethod">
              <Radio.Group
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="flex flex-col gap-6"
              >
                <Radio value="67bfce96db17315614fced6f">
                  Thanh toán khi nhận hàng
                </Radio>
                <Radio value="67bfcec4db17315614fced70">
                  Thanh toán qua ví điện tử VNPAY
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <Row gutter={24}>
            {/* Thanh toán */}
            <Col xs={24} md={16}>
              <Card className="bg-gray-100 h-full">
                <Title level={3} className="mb-2" style={{ fontSize: "20px" }}>
                  Thanh toán
                </Title>
                <Space direction="vertical" className="w-full">
                  <div className="flex justify-between">
                    <Text type="secondary">Tổng giá trị sản phẩm</Text>
                    <Text type="secondary">{totalPrice} đ</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">Giảm giá từ voucher</Text>
                    <Text type="secondary">{promotionValue} đ</Text>
                  </div>
                  <Divider />
                  <div className="flex justify-between">
                    <Text strong type="danger" style={{ fontSize: "17px" }}>
                      Tổng thanh toán
                    </Text>
                    <Text strong type="danger" style={{ fontSize: "17px" }}>
                      {paymentPrice} đ
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text type="danger">
                      Bạn đã tiết kiệm được:{" "}
                      <Text type="danger" strong>
                        {promotionValue} đ
                      </Text>
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Giảm giá */}
            <Col xs={24} md={8}>
              <Card className="bg-gray-100 h-full">
                <Title level={3} className="mb-2" style={{ fontSize: "20px" }}>
                  Mã giảm giá
                </Title>
                <Form.Item name="voucher">
                  <Select
                    placeholder="Mời bạn chọn voucher"
                    onChange={handleSelectChange}
                    className="w-full"
                    suffixIcon={<Tag className="text-gray-500 w-5 h-5" />}
                    size="large"
                  >
                    <Option value="0">Không dùng voucher</Option>
                    {voucherList.map((voucher: VoucherItem) => (
                      <Option
                        key={voucher._id}
                        value={voucher.value.toString()}
                        data-id={voucher._id}
                      >
                        {voucher.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  onClick={getPromotionValue}
                  className="w-full bg-black hover:bg-yellow-500"
                  size="large"
                >
                  Áp dụng
                </Button>
              </Card>
            </Col>
          </Row>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                      new Error("Vui lòng đồng ý với điều khoản và quy định")
                    ),
              },
            ]}
            className="mt-6"
          >
            <Checkbox>
              Đồng ý với các điều khoản và quy định của cửa hàng
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="w-full bg-black hover:bg-yellow-500"
              onClick={handleFormSubmit}
              loading={loading}
              size="large"
              htmlType="submit"
            >
              ĐẶT HÀNG
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center pt-2 flex items-center justify-center gap-2 text-gray-700">
          <Lock className="w-5 h-5 text-green-600" />
          <Text type="secondary">Đảm bảo thanh toán an toàn và bảo mật</Text>
        </div>
      </Card>
    </div>
  );
};

export default PaymentPage;
