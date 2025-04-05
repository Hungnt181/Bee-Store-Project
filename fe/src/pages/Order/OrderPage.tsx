import React, { useCallback, useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

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

const OrderPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemDetail[]>([]);
  const [cartModalItems, setCartModalItems] = useState<CartModalItemDetail[]>(
    []
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Lấy dữ liệu từ localStorage khi component được khởi tạo
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const getPdts = async (idProduct: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/products/" + idProduct
      );
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.log("ko lấy đc sp từ id", error);
    }
  };
  const fetchProducts = useCallback(async () => {
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
  }, [cartItems])

  const calculateTotalPrice = (items: CartModalItemDetail[]) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      render: (_text: string, record: CartModalItemDetail) => (
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
            rowKey={(_record, index) => (index ?? 0).toString()}
            pagination={false}
          />
          <div>
            Tổng tiền: <span className="font-bold">{totalPrice} vnd</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
