import React, { useEffect, useState } from "react";
import { Button, message, Modal, Table } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { TableRowSelection } from 'antd/es/table/interface';
import { formatCurrency } from "../../helpers/utils";


interface CartItemDetail {
  idProduct: string;
  idVariant: string;
  color: string;
  size: string;
  quantity: number;
}
interface CartModalItemDetail {
  idProduct: string;
  idVariant: string;
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

const CartPage: React.FC = () => {
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

  // if (cartItems && cartItems[0]) {
  //   console.log(cartItems[0]);
  // }

  const getPdts = async (idProduct: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/" + idProduct
      );
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log("ko lấy đc sp từ id");
    }
  };

  const getVariant = async (idVariant: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/variants/" + idVariant
      );
      // console.log(data.variants[0]);
      return data.variants[0];
    } catch (error) {
      console.log("ko lấy đc bien the từ id");
    }
  };

  const fetchProducts = async () => {
    const updatedCartModalItems: CartModalItemDetail[] = [];
    for (const cartItem of cartItems) {
      const productData = await getPdts(cartItem.idProduct);
      if (productData) {
        const newCartModalItem: CartModalItemDetail = {
          idProduct: cartItem.idProduct,
          idVariant: cartItem.idVariant,
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

  const handleQuantityChange = async (
    index: number,
    numberPerClick: number
  ) => {
    const updatedCartModalItems = [...cartModalItems];

    // lấy variant
    const variantData = await getVariant(cartItems[index].idVariant);

    // Kiểm tra và điều chỉnh số lượng sản phẩm
    let newQuantity = updatedCartModalItems[index].quantity + numberPerClick;
    if (newQuantity > variantData.quantity) {
      newQuantity = variantData.quantity;
    } else if (newQuantity < 1) {
      newQuantity = 1;
    }

    updatedCartModalItems[index].quantity = newQuantity;
    updatedCartModalItems[index].totalPrice =
      updatedCartModalItems[index].price * newQuantity;
    setCartModalItems(updatedCartModalItems);

    // Cập nhật localStorage
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const handleRemove = (index: number) => {
    const afterFilterCartModalItems = cartModalItems.filter(
      (_cartModalItem, cartModalItemIndex) => cartModalItemIndex !== index
    );
    setCartModalItems(afterFilterCartModalItems);

    //cập nhật local
    const updatedCartItems = cartItems.filter(
      (_cartItem, cartItemIndex) => cartItemIndex !== index
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const onCheckout = () => {
    if ((selectedItemArray) && (selectedItemArray.length > 0)) {
      navigate("/payment");
    }
    else {
      if (cartItems && cartItems.length > 0){
        message.error("Cần chọn sản phẩm để thanh toán", 3);
      }
      else{
        message.error("Không có sản phẩm để thanh toán", 3);
      }
      return;
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
      render: (nameProduct: string, record: CartModalItemDetail) => (
        <Link to={`/products/${record.idProduct}`} ><span className="text-black">{nameProduct}</span></Link>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_text:string, record: CartModalItemDetail) => (
        <span>{formatCurrency(record.price, 'vnd')}</span>
      ),
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
        <div className="quantity-control flex items-center">
          <Button
            onClick={() => handleQuantityChange(index, -1)}
            disabled={record.quantity <= 1}
            style={{ height: "30px", width: "30px" }}
          >
            -
          </Button>
          <div className="quantity mx-2 w-[20px] text-center">{record.quantity}</div>
          <Button
            onClick={() => handleQuantityChange(index, 1)}
            style={{ height: "30px", width: "30px" }}
          >+</Button>
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_text: string, record: CartModalItemDetail) => (
        <span className="font-bold">{formatCurrency(record.price * record.quantity, 'vnd')}</span>
      ),
    },
    {
      title: "#",
      key: "action",
      render: (_text:string, _record: CartModalItemDetail, index: number) => (
        <Button onClick={() => handleRemove(index)}>Xóa</Button>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  };
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [selectedItemArray, setSelectedItemArray] = useState<any>([])
  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      const newSelectedItemArray = selectedRowKeys.map((index) =>
        cartModalItems[Number(index)]
      );
      //cartModalItems.map(index => selectedRowKeys[Number(index)])
      setSelectedItemArray(newSelectedItemArray)
    }
    else {
      setSelectedItemArray([]);
    }
  }, [selectedRowKeys, cartModalItems]);

  useEffect(() => {
    // console.log("selectedItemArray updated:", selectedItemArray);
    if (selectedItemArray.length > 0) {
      localStorage.setItem("selectedItemArray", JSON.stringify(selectedItemArray));
    } else {
      localStorage.removeItem("selectedItemArray");
    }
  }, [selectedItemArray]);

  return (
    <>
      <div className="mt-5 max-w-[1240px] mx-6 xl:mx-auto text-right">
        <div className="text-left">
          <Table
            rowSelection={rowSelection}
            dataSource={cartModalItems}
            columns={columns}
            rowKey={(_record, index) => (index)?(index.toString()): ''}
            pagination={false}
          />
          <div className="mt-3">
            Tổng tiền: <span className="font-bold">{formatCurrency(totalPrice, 'vnd')}</span>
          </div>
        </div>

        <Button key="checkout" onClick={onCheckout} className="mt-3">
          Thanh toán
        </Button>
      </div>
    </>
  );
};

export default CartPage;
