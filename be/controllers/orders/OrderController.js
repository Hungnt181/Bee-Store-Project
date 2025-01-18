import Order from "../models/orders/Order.js";

import ItemsOrder from "../models/itemOrder/product.js" //bang itemOrder

class OrderController {

    async createOrder(req, res) {
        try {
            const { orderItemsOrder } = req.body;

            // Kiểm tra so item order
            const itemsOrders = await ItemsOrder.find({ _id: { $in: orderItemsOrder } });
            if (itemsOrders.length !== itemsOrders.length) {
                return res.status(400).json({ message: "Một hoặc nhiều itemOrder không tìm thấy" });
            }
            // có thể ko cần thiết check phần này


            const order = await Order.create(req.body);
            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const { _embed } = req.query;
            let query = Order.findById(id);

            if (_embed) {
                const embeds = _embed.split(",");
                embeds.forEach((embed) => {
                    query = query.populate(embed);
                });
            }

            const order = await query.exec();
            if (!order) {
                return res.status(404).json({ message: "Không tìm thấy order" });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    async getOrders(req, res) {
        try {
            const { _page = 1, _limit = 10, _embed } = req.query;
            const options = {
                page: parseInt(_page, 10),
                limit: parseInt(_limit, 10),
            };

            let query = Order.find();

            if (_embed) {
                const embeds = _embed.split(",");
                embeds.forEach((embed) => {
                    query = query.populate(embed);
                });
            }

            const result = await Order.paginate(query, options);
            const { docs, ...paginationData } = result; // Loại bỏ trường docs

            return res.status(200).json({
                orders: docs,
                ...paginationData,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}
export default OrderController