import { Router } from "express";
import VoucherController from "../controllers/VoucherController.js";
// import { checkPermission } from "../middlewares/index.js"; 

const vouchervoucherApiRouter = Router();
const voucherController = new VoucherController();

//khai báo router:
//voucherApiRouter.method('/url', checkPermission [middleware bao ve route khi ko signin]  ,tenController.tenHam);
voucherApiRouter.get('/api/vouchers', voucherController.apiList); 
voucherApiRouter.get('/api/vouchers/:id', voucherController.apiDetail); 
// voucherApiRouter.delete('/vouchers/:id',checkPermission , voucherController.apiDelete);
voucherApiRouter.post('/api/vouchers', voucherController.apiCreate);
voucherApiRouter.put('/api/vouchers/:id', voucherController.apiUpdate);

export default voucherApiRouter;
