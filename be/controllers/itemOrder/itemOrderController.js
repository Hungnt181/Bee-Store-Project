import StatusCodes from "http-status-codes";
import ItemOrder from "../../models/itemOrder/product";
class ItemOrderController {
  // Get all items in the order
  async getAllItemOrder(req, res) {
    try {
      const { _page = 1, _limit = 10 } = req.query;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };
      let query = ItemOrder.find().populate({
        path: "id_variant",
        select: "id_color id_size id_product -_id",
        populate: [
          {
            path: "id_product",
            select: "name price -_id",
          },
          {
            path: "id_color",
            select: "name -_id",
          },
          {
            path: "id_size",
            select: "name -_id",
          },
        ],
      });
      const result = await ItemOrder.paginate(query, options);
      const { docs, ...paginationData } = result;

      return res.status(StatusCodes.OK).json({
        itemOrders: docs,
        ...paginationData,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}

export default ItemOrderController;
