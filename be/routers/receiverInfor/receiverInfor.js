import { Router } from "express";
import { add, list } from "../../controllers/receiverInfor/receiverController";



export const receiverRouter = Router();

// Định nghĩa các route cho receiverInfor
receiverRouter.post("/receivers", add); // Thêm người nhận
receiverRouter.get("/receivers", list); // Lấy danh sách người nhận

// {
//     "name":"Smâmma",
//     "email":"Dang12@gmail.com",
//     "phone":"0354010126",
//     "address":"Tuyen quang"
// }