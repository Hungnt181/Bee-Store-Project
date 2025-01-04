import Product from "../../models/products/product";
import StatusCodes from "http-status-codes";
import slugify from "slugify";
import { productValidator } from "../../utils/validator/product";
class ProductController {
  // Get all products
  async getAllProducts(req, res) {
    try {
      const { _page = 1, _limit = 10, _embed } = req.query;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };

      let query = Product.find();

      // if (_embed) {
      //   const embeds = _embed.split(",");
      //   embeds.forEach((embed) => {
      //     query = query.populate(embed);
      //   });
      // }

      const result = await Product.paginate(query, options);
      const { docs, ...paginationData } = result;

      return res.status(StatusCodes.OK).json({
        products: docs,
        ...paginationData,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Tạo mới sản phẩm
  async createProduct(req, res) {
    try {
      const { error, value } = productValidator.validate(req.body);
      if (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: error.details[0].message });
      }

      const { name } = value;

      // Kiểm tra xem sản phẩm với tên này đã tồn tại chưa
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Sản phẩm với tên này đã tồn tại" });
      }

      // Tạo slug từ tên sản phẩm
      const slug = slugify(name, { lower: true });

      const product = await Product.create({ ...value, slug });
      res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}

export default ProductController;
