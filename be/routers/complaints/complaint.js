import { Router } from "express";
import ComplaintController from "../../controllers/complaints/complaints";

const complaintController = new ComplaintController();
const complaintRouter = Router();
// ADD  item Order
complaintRouter.post("/complaint", complaintController.createComplaint);
// Get All item Order
complaintRouter.get("/complaint", complaintController.getAllComplaints);
export default complaintRouter;
