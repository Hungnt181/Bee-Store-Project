import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import router from "./routers/index.js";
import "./controllers/orders/CornOrder.js";
const app = express();

// real-time
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL của frontend ReactJS chạy bằng Vite
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// routers
app.use("", router);
// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/DATN");

// Lắng nghe kết nối từ client
io.on("connection", (socket) => {
  console.log("Client kết nối:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client ngắt kết nối:", socket.id);
  });
});

// Khởi động server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

export const viteNodeApp = app;
export { io };
