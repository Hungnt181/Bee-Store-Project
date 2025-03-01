import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Order } from "../../../interface/Order";
import { useParams } from "react-router-dom";

const AdminOrderDetail = () => {
  const [dataTable, setDataTable] = useState<Order[]>([]);

  const { id } = useParams();
  const url = `http://localhost:3000/api/orders/${id}?_embed=user,voucher,payment,itemsOrder`;
  const key = "dataPageOrder";

  const { data: data_Order, isLoading } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
  });

  useEffect(() => {
    if (data_Order) {
      setDataTable(data_Order.orders);
    }
  }, [data_Order]);

  console.log("dataTable", dataTable);

  return (
    <div>
      <h1 style={{ margin: "0 0 5px 0" }}>CHI TIẾT ĐƠN HÀNG</h1>
      <Skeleton loading={isLoading}></Skeleton>
    </div>
  );
};

export default AdminOrderDetail;
