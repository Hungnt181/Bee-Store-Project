import { notification } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { io } from "socket.io-client";
const RealTime = () => {
  const [api, contextHolder] = notification.useNotification();
  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnection: true,
  }); // Thêm transports

  useEffect(() => {
    // Kết nối Socket.IO
    socket.on("connect", () => {
      console.log("Kết nối tới server thành công!", socket.id);
    });

    // Nhận sự kiện newOrder từ backend
    socket.on("newOrder", async (order) => {
      console.log("Có đơn hàng mới:", order);
      api.info({
        message: "Có đơn hàng mới!",
        description: `Mã đơn : ${order?._id} - Tổng tiền: ${order?.total} VNĐ`,
        placement: "topRight",
      });
      // api create notifications

      try {
        await axios.post("http://localhost:3000/api/notifications", {
          message: `Có đơn hàng mới( Mã đơn : ${order?._id} ) - Tổng tiền: ${order?.total} VNĐ`,
          id_order: order._id,
        });
      } catch (error) {
        console.log(error);
      }
    });

    // Dọn dẹp khi component bị unmount
    return () => {
      socket.off("newOrder");
    };
  }, [api]);
  return <div>{contextHolder}</div>;
};

export default RealTime;
