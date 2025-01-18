import { Router } from "express";
import VoucherController from "../controllers/VoucherController.js";
// import { checkPermission } from "../middlewares/index.js"; 

const voucherApiRouter = Router();
const voucherController = new VoucherController();

//khai báo router:
//voucherApiRouter.method('/url', checkPermission [middleware bao ve route khi ko signin]  ,tenController.tenHam);
voucherApiRouter.get('/vouchers', voucherController.apiList); 
voucherApiRouter.get('/vouchers/:id', voucherController.apiDetail); 
// voucherApiRouter.delete('/vouchers/:id',checkPermission , voucherController.apiDelete);
voucherApiRouter.post('/vouchers', voucherController.apiCreate);
voucherApiRouter.put('/vouchers/:id', voucherController.apiUpdate);

export default voucherApiRouter;
