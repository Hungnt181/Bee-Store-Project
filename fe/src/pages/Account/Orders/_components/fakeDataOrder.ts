import dayjs from "dayjs";
import { DataType } from "./Columns";

const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const orderStatuses = [
  "pending",
  "cancelled",
  "confirmed",
  "shipping",
  "delivered",
  "done",
];

const paymentMethods = ["Online", "COD"];

export const fakeOrders: DataType[] = Array.from({ length: 5 }, (_, index) => ({
  _id: `ORDER${index + 1}`,
  paymentMethod: getRandomElement(paymentMethods) as
    | "Online"
    | "COD",
  orderStatus: getRandomElement(orderStatuses),
  totalPrice: Math.floor(Math.random() * 500000) + 100000, // Từ 100,000đ đến 600,000đ
  createdAt: dayjs()
    .subtract(Math.floor(Math.random() * 30), "day")
    .toISOString(), // Ngày ngẫu nhiên trong vòng 30 ngày qua
}));
