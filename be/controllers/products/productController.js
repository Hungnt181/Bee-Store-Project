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
      if (_embed) {
        const embeds = _embed.split(",");
        // console.log(embeds);
        embeds.forEach((embed) => {
          query = query.populate(embed);
        });
      }
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

  // Get product detail by id
  async getProducDetail(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      return res.status(StatusCodes.OK).json(product);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
  // Tạo mới sản phẩm
  async createProduct(req, res) {
    try {
      const { error, value } = productValidator.validate(req.body, {
        abortEarly: false,
      });
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

  // Cập nhật sản phẩm
  async updateProduct(req, res) {
    try {
      const { error, value } = productValidator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: error.message });
      }
      // console.log(value);
      const { id } = req.params;
      // Tạo slug từ name nếu name có trong dữ liệu cập nhật
      if (value.name) {
        value.slug = slugify(value.name, { lower: true });
      }
      const product = await Product.findByIdAndUpdate(id, value, {
        new: true, // Trả về sản phẩm sau khi update
      });
      if (!product) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy sản phẩm" });
      }
      res.status(StatusCodes.OK).json(product);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}

export default ProductController;
