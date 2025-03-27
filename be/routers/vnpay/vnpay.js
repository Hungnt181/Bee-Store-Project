import { Router } from "express";
import VNPayController from "../../controllers/vnpayPayment/VNPayPayment";

const vnpayRouter = Router();
const vnpayControl = new VNPayController();

vnpayRouter.post("/create_payment_url", vnpayControl.createBill);
vnpayRouter.get("/payment-result", vnpayControl.returnPayment);
// vnpayRouter.post("/check-payment", vnpayControl.checkPayment);

export default vnpayRouter;