import React, { useEffect, useState } from "react";
import { Button, message, Modal, Table, Tag } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { TableRowSelection } from "antd/es/table/interface";
import { formatCurrency } from "../../helpers/utils";

interface CartItemDetail {
  idProduct: string;
  idVariant: string;
  color: string;
  nameColor: string;
  size: string;
  quantity: number;
}
interface CartModalItemDetail {
  idProduct: string;
  idVariant: string;
  nameProduct: string;
  price: number;
  color: string;
  nameColor: string;
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
  const idUser = localStorage.getItem("idUser");

  const navigate = useNavigate();

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

  const [outStockArray, setOutStockArray] = useState<string[]>([])
  const [stopSellArray, setStopSellArray] = useState<string[]>([])

  // Lấy dữ liệu từ localStorage khi component được khởi tạo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const idUser = localStorage.getItem("idUser");
        if (!idUser) {
          // console.error("Không tìm thấy idUser trong localStorage.");
          const storedCartItems = localStorage.getItem("cartItems");
          if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
          }
          return;
        }


        const { data } = await axios.get(`http://localhost:3000/api/cart/${idUser}`);
        console.log(data.data.items);

        let idOutStock = [];
        let idStopSell = [];
        const updatedFromCartDB = [];
        for (const item of data.data.items) {
          const productData = await getPdts(item.idProduct);
          const variantData = await getVariant(item.idVariant)
          if (productData) {
            updatedFromCartDB.push({
              idProduct: item.idProduct,
              idVariant: item.idVariant,
              nameProduct: productData.name,
              price: productData.price,
              color: item.color,
              nameColor: item.nameColor,
              size: item.size,
              quantity: item.quantity,
              totalPrice: productData.price * item.quantity,
            });
            // console.log('so luong ton ', variantData.quantity);
            //tạo mảng id het hang
            if (variantData.quantity <= 0) {
              idOutStock.push(item.idVariant)
            }
            console.log(productData.status);
            if (productData.status == false){
              idStopSell.push(item.idProduct)
            }
            if (variantData.status == false) {
              idStopSell.push(item.idVariant)
            }
          }
        }
        setStopSellArray(idStopSell);
        setOutStockArray(idOutStock);
        console.log('id ', idOutStock);

        setCartItems(updatedFromCartDB);
        localStorage.setItem('cartItems', JSON.stringify(updatedFromCartDB));
      } catch (error) {
        console.error("Lỗi khi xử lý giỏ hàng");
      }
    };

    fetchData();
  }, []);
  // if (cartItems && cartItems[0]) {
  //   console.log(cartItems[0]);
  // }


  const fetchProducts = async () => {
    const updatedCartModalItems: CartModalItemDetail[] = [];
    if (cartItems.length > 0) {
      for (const cartItem of cartItems) {
        const productData = await getPdts(cartItem.idProduct);
        if (productData) {
          const newCartModalItem: CartModalItemDetail = {
            idProduct: cartItem.idProduct,
            idVariant: cartItem.idVariant,
            nameProduct: productData.name,
            price: productData.price,
            color: cartItem.color,
            nameColor: cartItem.nameColor,
            size: cartItem.size,
            quantity: cartItem.quantity,
            totalPrice: productData.price * cartItem.quantity,
          };
          updatedCartModalItems.push(newCartModalItem);
        }
      }
    }
    setCartModalItems(updatedCartModalItems);
    calculateTotalPrice(updatedCartModalItems);
    // console.log(cartItems);
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

    // cập nhật bảng cart
    if (idUser) {
      try {
        await axios.patch(`http://localhost:3000/api/cart/${idUser}/updateQuantity/${cartItems[index].idVariant}`, { quantity: newQuantity });
        console.log("Đã cập nhật giỏ hàng");
      } catch (error) {
        console.error("Lỗi cập nhật giỏ hàng");
      }
    }
  };

  const handleRemove = async (index: number) => {
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

    //cap nhat bảng Cart
    if (idUser) {
      try {
        await axios.patch(`http://localhost:3000/api/cart/${idUser}/delete/${cartItems[index].idVariant}`);
        console.log("Đã cập nhật giỏ hàng");
      } catch (error) {
        console.error("Lỗi cập nhật giỏ hàng");
      }
    }
  };

  const onCheckout = () => {
    if (selectedItemArray && selectedItemArray.length > 0) {
      navigate("/payment");
    } else {
      if (cartItems && cartItems.length > 0) {
        message.error("Cần chọn sản phẩm để thanh toán", 3);
      } else {
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
        <Link to={`/products/${record.idProduct}`}>
          <span className="text-black">{nameProduct}</span>
        </Link>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_text: string, record: CartModalItemDetail) => (
        <span>{formatCurrency(record.price, "vnd")}</span>
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
      render: (_text: string, record: CartModalItemDetail, index: number) => {
        if (stopSellArray.includes(record.idVariant) || stopSellArray.includes(record.idProduct)) {
          return (
            <div>
              <Tag color="red">Sản phẩm dừng bán</Tag>
            </div>
          )
        }
        else if (outStockArray.includes(record.idVariant)) {
          return (
            <div>
              <Tag color="red">Hết hàng trong kho</Tag>
            </div>
          )
        }
        else {
          return (
            <div className="quantity-control flex items-center">
              <Button
                onClick={() => handleQuantityChange(index, -1)}
                disabled={record.quantity <= 1}
                style={{ height: "30px", width: "30px" }}
              >
                -
              </Button>
              <div className="quantity mx-2 w-[20px] text-center">
                {record.quantity}
              </div>
              <Button
                onClick={() => handleQuantityChange(index, 1)}
                style={{ height: "30px", width: "30px" }}
              >
                +
              </Button>
            </div>
          )
        }
      }
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_text: string, record: CartModalItemDetail) => (
        <span className="font-bold">
          {formatCurrency(record.price * record.quantity, "vnd")}
        </span>
      ),
    },
    {
      title: "#",
      key: "action",
      render: (_text: string, _record: CartModalItemDetail, index: number) => (
        <Button onClick={() => handleRemove(index)}>Xóa</Button>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: stopSellArray.includes(record.idVariant) || outStockArray.includes(record.idVariant),
    }),

  };
  // console.log('out ',outStockArray);

  const [selectedItemArray, setSelectedItemArray] = useState<any>([]);
  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      const newSelectedItemArray = selectedRowKeys.map(
        (index) => cartModalItems[Number(index)]
      );
      //cartModalItems.map(index => selectedRowKeys[Number(index)])
      setSelectedItemArray(newSelectedItemArray);
    } else {
      setSelectedItemArray([]);
    }
  }, [selectedRowKeys, cartModalItems]);

  useEffect(() => {
    // console.log("selectedItemArray updated:", selectedItemArray);
    if (selectedItemArray.length > 0) {
      localStorage.setItem(
        "selectedItemArray",
        JSON.stringify(selectedItemArray)
      );
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
            rowKey={(_record, index) => (index ? index.toString() : "")}
            pagination={false}
          />
          <div className="mt-3 text-right">
            Tổng tiền:{" "}
            <span className="font-bold">
              {formatCurrency(totalPrice, "vnd")}
            </span>
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
