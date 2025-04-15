import Complaint from "../../models/complaints/complaints";
import Order from "../../models/orders/Order";
import { complaintValidator } from "../../utils/validator/complaint";
import { StatusCodes } from "http-status-codes";
class ComplaintController {
  // Get all complaints
  async getAllComplaints(req, res) {
    try {
      const { _page = 1, _limit = 10, _embed } = req.query;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };
      let query = {};
      let complaintQuery = Complaint.find(query);
      if (_embed) {
        const embeds = _embed.split(",");
        embeds.forEach((embed) => {
          complaintQuery = complaintQuery.populate(embed);
        });
      }
      complaintQuery = complaintQuery.sort({ createdAt: -1 });
      const result = await Complaint.paginate(complaintQuery, options);
      const { docs, ...paginationData } = result;
      return res.status(StatusCodes.OK).json({
        complaints: docs,
        ...paginationData,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Create a new complaint

  async createComplaint(req, res) {
    try {
      const { error, value } = complaintValidator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: error.details[0].message });
      }
      if (value?.id_order) {
        const order = await Order.findById(value.id_order);
        if (!order?.isConfirm) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Vui lòng xác nhận đơn hàng trước khi khiếu nại",
          });
        }
      }
      const complaint = await Complaint.create(value);
      if (complaint && value?.id_order) {
        await Order.findByIdAndUpdate(value.id_order, {
          isComplaint: true,
        });
      }
      res.status(StatusCodes.CREATED).json(complaint);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
export default ComplaintController;
