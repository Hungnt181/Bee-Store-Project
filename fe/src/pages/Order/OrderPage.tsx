import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CartItemDetail {
  idProduct: string;
  idVariant: string;
  color: string;
  size: string;
  quantity: number;
}
interface CartModalItemDetail {
  nameProduct: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  totalPrice: number;
}

// interface CartModalData {
//     isOpen: boolean;
//     cartItems: CartItemDetail[];
//     onClose: () => void;
//     onCheckout: () => void;
// }

const OrderPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemDetail[]>([]);
  const [cartModalItems, setCartModalItems] = useState<CartModalItemDetail[]>(
    []
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const navigate = useNavigate();

  // Lấy dữ liệu từ localStorage khi component được khởi tạo
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  if (cartItems && cartItems[0]) {
    console.log(cartItems[0]);
  }

  const getPdts = async (idProduct: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/" + idProduct
      );
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.log("ko lấy đc sp từ id");
    }
  };
  const fetchProducts = async () => {
    const updatedCartModalItems: CartModalItemDetail[] = [];
    for (const cartItem of cartItems) {
      const productData = await getPdts(cartItem.idProduct);
      if (productData) {
        const newCartModalItem: CartModalItemDetail = {
          nameProduct: productData.name,
          price: productData.price,
          color: cartItem.color,
          size: cartItem.size,
          quantity: cartItem.quantity,
          totalPrice: productData.price * cartItem.quantity,
        };
        updatedCartModalItems.push(newCartModalItem);
      }
    }
    setCartModalItems(updatedCartModalItems);
    calculateTotalPrice(updatedCartModalItems);
    // console.log(cartModalItems);
  };

  const calculateTotalPrice = (items: CartModalItemDetail[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchProducts();
  }, [cartItems]);

  const onCheckout = () => {
    console.log("checkout clicked");
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      className: "text-center",
      render: (color: string) => (
        <div
          className={`w-[20px] h-[20px] border bg-[${color}]`}
          style={{ backgroundColor: color }}
        ></div>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_text: string, record: CartModalItemDetail, index: number) => (
        <div className="quantity-control">
          <span className="quantity">{record.quantity}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];

  return (
    <>
      <div className="mt-5 max-w-[1240px] mx-6 xl:mx-auto text-right">
        <div className="text-left">
          <Table
            dataSource={cartModalItems}
            columns={columns}
            rowKey={(record, index) => index.toString()}
            pagination={false}
          />
          <div>
            Tổng tiền: <span className="font-bold">{totalPrice} vnd</span>
          </div>
        </div>
        {/* <Button key="checkout" onClick={onCheckout} className='mt-3'>
                    Thanh toán
                </Button> */}
      </div>
      {/* <div className="contentCheckout col-md-12 col-xs-12 col-sm-12">
        <div className="main-content checkoutStep col-md-8 col-xs-12 col-sm-12">
          <div className="section-header">
            <h2 className="section-title">Thông tin khách hàng</h2>
          </div>
          <div className="customer-information">
            <div className="section-content-inner">
              <div className="form-group">
                <input
                  placeholder="Họ và tên"
                  type="text"
                  name="customerName"
                  className="validate[required] form-control"
                  value=""
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Email"
                  type="text"
                  name="customerEmail"
                  className="form-control"
                  value=""
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Số điện thoại"
                  type="text"
                  name="customerMobile"
                  className="validate[required,custom[phone]] form-control"
                  value=""
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Địa chỉ"
                  type="text"
                  name="customerAddress"
                  className="validate[required] form-control"
                  value=""
                />
              </div>
              <div className="form-group">
                <select
                  id="customcityId"
                  name="customerCityId"
                  className="validate[required] form-control"
                >
                  <option data-code="null" value="null">
                    Chọn tỉnh / thành
                  </option>
                  <option value="256">An Giang</option>
                  <option value="257">Bà Rịa - Vũng Tàu</option>
                  <option value="260">Bình Dương</option>
                  <option value="262">Bình Phước</option>
                  <option value="263">Bình Thuận</option>
                  <option value="261">Bình Định</option>
                  <option value="315">Bạc Liêu</option>
                  <option value="265">Bắc Cạn</option>
                  <option value="259">Bắc Giang</option>
                  <option value="258">Bắc Ninh</option>
                  <option value="264">Bến Tre</option>
                  <option value="274">Cao Bằng</option>
                  <option value="273">Cà Mau</option>
                  <option value="266">Cần Thơ</option>
                  <option value="275">Gia Lai</option>
                  <option value="276">Hà Giang</option>
                  <option value="277">Hà Nam</option>
                  <option value="254">Hà Nội</option>
                  <option value="278">Hà Tĩnh</option>
                  <option value="281">Hòa Bình</option>
                  <option value="282">Hưng Yên</option>
                  <option value="279">Hải Dương</option>
                  <option value="280">Hải Phòng</option>
                  <option value="314">Hậu Giang</option>
                  <option value="255">Hồ Chí Minh</option>
                  <option value="267">Khánh Hòa</option>
                  <option value="283">Kiên Giang</option>
                  <option value="284">Kon Tum</option>
                  <option value="285">Lai Châu</option>
                  <option value="288">Long An</option>
                  <option value="269">Lào Cai</option>
                  <option value="286">Lâm Đồng</option>
                  <option value="287">Lạng Sơn</option>
                  <option value="272">Nam Định</option>
                  <option value="289">Nghệ An</option>
                  <option value="290">Ninh Bình</option>
                  <option value="291">Ninh Thuận</option>
                  <option value="292">Phú Thọ</option>
                  <option value="293">Phú Yên</option>
                  <option value="294">Quảng Bình</option>
                  <option value="295">Quảng Nam</option>
                  <option value="296">Quảng Ngãi</option>
                  <option value="270">Quảng Ninh</option>
                  <option value="297">Quảng Trị</option>
                  <option value="298">Sóc Trăng</option>
                  <option value="299">Sơn La</option>
                  <option value="303">Thanh Hóa</option>
                  <option value="268">Thành Phố Huế</option>
                  <option value="301">Thái Bình</option>
                  <option value="302">Thái Nguyên</option>
                  <option value="304">Tiền Giang</option>
                  <option value="305">Trà Vinh</option>
                  <option value="306">Tuyên Quang</option>
                  <option value="300">Tây Ninh</option>
                  <option value="307">Vĩnh Long</option>
                  <option value="308">Vĩnh Phúc</option>
                  <option value="309">Yên Bái</option>
                  <option value="316">Điện Biên</option>
                  <option value="312">Đà Nẵng</option>
                  <option value="310">Đắk Lắk</option>
                  <option value="313">Đắk Nông</option>
                  <option value="271">Đồng Nai</option>
                  <option value="311">Đồng Tháp</option>{" "}
                </select>
              </div>
              <div className="form-group">
                <select
                  id="customdistrictId"
                  name="customerDistrictId"
                  className="validate[required] form-control"
                >
                  <option value="">Chọn quận / huyện</option>
                </select>
              </div>

              <div className="section">
                <h3 className="section-title ">Phương thức thanh toán</h3>
                <div id="paymentMethod">
                  <div className="b">
                    <label>
                      <input
                        type="radio"
                        id="rdPaymentMethodCod"
                        name="paymentMethod"
                        className="validate[required]"
                        value="1"
                      />
                      Thanh toán khi nhận hàng{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-content col-md-4 col-xs-12 col-sm-12">
          <h2 className="section-title">Thanh toán</h2>
          <table className="table">
            <tbody>
              <tr>
                <td className="tabl-label">Tạm tính</td>
                <td>1,390,000 đ</td>
              </tr>
              <tr>
                <td className="tabl-label">Giảm giá</td>
                <td id="txtCoupon">0 đ</td>
              </tr>
              <tr>
                <td className="tabl-label">Phí vận chuyển</td>
                <td id="shipfee">0 đ</td>
              </tr>
              <tr>
                <td className="tabl-label">Thành tiền</td>
                <td id="showTotalMoney">1,390,000 đ</td>
              </tr>
            </tbody>
          </table>
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <div className="tabl-label section-title">Mã giảm giá</div>
                  <div className="field-counpon">
                    <input
                      placeholder="Mã giảm giá"
                      className="form-control"
                      id="coupon"
                      type="text"
                      name="couponCode"
                      value=""
                    />
                    <button
                      type="button"
                      id="getCoupon"
                      className="field-input-btn btn btn-default"
                    >
                      <span className="btn-content">
                        Áp dụng{" "}
                        <i
                          className="fa fa-long-arrow-right"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <input
            type="hidden"
            id="baokimPmMethodId"
            name="baokimBankPaymentMethodId"
          />
        </div>
      </div> */}
    </>
  );
};

export default OrderPage;
