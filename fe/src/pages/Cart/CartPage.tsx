import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import axios from 'axios';

interface CartItemDetail {
    idProduct: string,
    idVariant: string,
    color: string,
    size: string,
    quantity: number,
}
interface CartModalItemDetail {
    nameProduct: string,
    price: number,
    color: string,
    size: string,
    quantity: number,
    totalPrice: number,
}

interface CartModalData {
    isOpen: boolean;
    cartItems: CartItemDetail[];
    onClose: () => void;
    onCheckout: () => void;
}

const CartPage: React.FC<CartModalData> = ({ isOpen, cartItems, onCheckout }) => {

    const [cartModalItems, setCartModalItems] = useState<CartModalItemDetail[]>([]);

    if (cartItems && cartItems[0]) {
        console.log(cartItems[0]);
    }
    const getPdts = async (idProduct: string) => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/products/' + idProduct);
            console.log(data.data);
            return data.data
        }
        catch (error) {
            console.log("ko lấy đc sp từ id");
        }
    }

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
        };
        setCartModalItems(updatedCartModalItems);
        console.log(cartModalItems);

    };
    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen, cartItems]);

    const handleRemove = (index: number) => {
        const afterFilterCartModalItems = cartModalItems.filter((_cartModalItem, cartModalItemIndex) => cartModalItemIndex !== index);
        setCartModalItems(afterFilterCartModalItems);
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'nameProduct',
            key: 'nameProduct',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            className: 'text-center',
            render: (color: string) => (
                <div className={`w-[20px] h-[20px] border bg-[${color}]`} style={{ backgroundColor: color }}></div>
            ),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: '#',
            key: 'action',
            render: (text, record: CartModalItemDetail, index: number) => (
                <Button onClick={() => handleRemove(index)}>Remove</Button>
            ),
        },
    ];

    return (
        <>
            <Table
                dataSource={cartModalItems}
                columns={columns}
                rowKey={(index) => index.toString()}
                pagination={false}
            />
        </>
    );
};

export default CartPage;