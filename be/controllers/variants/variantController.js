import StatusCodes from "http-status-codes";
import Variant from "../../models/variants/variants";
import { VariantValidator } from "../../utils/validator/variant";
import Product from "../../models/products/product";

class VariantController {
  // Get All Variants
  async getAllVariants(req, res) {
    try {
      // api/variants?_embed=id_product,id_size,id_color
      const { _page = 1, _limit = 10, _embed } = req.query;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };
      let query = Variant.find();

      if (_embed) {
        const embeds = _embed.split(",");
        embeds.forEach((embed) => {
          query = query.populate(embed);
        });
      }
      // let query = Variant.find().populate([
      //   {
      //     path: "id_product",
      //     select: "name price about description status id_cate slug -_id",
      //     populate: {
      //       path: "id_cate",
      //       select: "name -_id",
      //     },
      //   },
      //   {
      //     path: "id_color",
      //     select: "name -_id",
      //   },
      //   {
      //     path: "id_size",
      //     select: "name -_id",
      //   },
      // ]);
      const result = await Variant.paginate(query, options);
      const { docs, ...paginationData } = result;

      return res.status(StatusCodes.OK).json({
        variants: docs,
        ...paginationData,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Get variant by id_variant
  async getAllVariantById_Variant(req, res) {
    try {
      // api/1?_embed=id_product,id_size,id_color
      const { _page = 1, _limit = 10, _embed } = req.query;
      const { id_variant } = req.params;

      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };
      let query = Variant.findById(id_variant);

      if (_embed) {
        const embeds = _embed.split(",");
        embeds.forEach((embed) => {
          query = query.populate(embed);
        });
      }
      const result = await Variant.paginate(query, options);

      const { docs, ...paginationData } = result;

      return res.status(StatusCodes.OK).json({
        variants: docs,
        ...paginationData,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Get variant by id_cate
  async getVariantsByCateID(req, res) {
    try {
      const { _page = 1, _limit = 10 } = req.query;
      const { id_cate } = req.params;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };
      // Tìm tất cả các products có id_cate tương ứng
      const products = await Product.find({ id_cate: id_cate }, "_id");
      const productIds = products.map((product) => product._id);

      // Lấy tất cả các variants có id_product thuộc các products tìm được
      let query = Variant.find({ id_product: { $in: productIds } }).populate([
        {
          path: "id_product",
          select: "name price about description status id_cate slug -_id",
          populate: {
            path: "id_cate",
            select: "name -_id",
          },
        },
        {
          path: "id_color",
          select: "name -_id",
        },
        {
          path: "id_size",
          select: "name -_id",
        },
      ]);

      const result = await Variant.paginate(query, options);
      const { docs, ...paginationData } = result;

      return res.status(StatusCodes.OK).json({
        variants: docs,
        ...paginationData,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Get variant by id_product
  async getVariantsByProID(req, res) {
    try {
      const { _page = 1, _limit = 10 } = req.query;
      const { id_product } = req.params;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };

      let query = Variant.find({ id_product: id_product }).populate([
        {
          path: "id_product",
          // select: "name price about description status id_cate slug -_id",
          populate: {
            path: "id_cate",
            select: "name ",
          },
        },
        {
          path: "id_color",
          select: "name hexcode -_id",
        },
        {
          path: "id_size",
          select: "name -_id",
        },
      ]);
      // .sort({ "id_size.name": 1, "id_color.name": 1 });

      const result = await Variant.paginate(query, options);
      const { docs, ...paginationData } = result;

      const sizeText = ["S", "M", "L", "XL", "XXL"];
      docs.sort((a, b) => {
        const sizeA = a.id_size.name;
        const sizeB = b.id_size.name;
        // Kiểm tra nếu size là số hay không
        const isNumA = !isNaN(sizeA);
        const isNumB = !isNaN(sizeB);
        if (isNumA && isNumB) {
          // Nếu cả hai là số, so sánh theo số
          return parseInt(sizeA) - parseInt(sizeB);
        } else if (!isNumA && !isNumB) {
          // Nếu cả hai là chữ, so sánh theo mảng sizeOrder
          const indexA = sizeText.indexOf(sizeA);
          const indexB = sizeText.indexOf(sizeB);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          return sizeA.localeCompare(sizeB); // Nếu không có trong danh sách, sắp xếp theo chữ cái
        } else {
          // Nếu một cái là số, một cái là chữ -> số sẽ được đặt trước chữ
          return isNumA ? -1 : 1;
        }
      });

      return res.status(StatusCodes.OK).json({
        variants: docs,
        ...paginationData,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Create new variant
  async createVariant(req, res) {
    try {
      const { error, value } = VariantValidator.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: error.details[0].message });
      }

      const { id_product, id_color, id_size } = value;
      const existingProduct = await Variant.findOne({
        id_product,
        id_color,
        id_size,
      });
      if (existingProduct) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Đã tồn tại màu và kích cỡ ở mã sản phẩm này",
        });
      }

      const variant = await Variant.create(value);
      res.status(StatusCodes.OK).json({
        message: "Create variant successfully",
        data: variant,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Update variant
  async updateVariant(req, res) {
    try {
      const { error, value } = VariantValidator.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: error.details[0].message });
      }

      const { id_product, id_color, id_size } = value;
      const { id } = req.params;
      // Check xem có variant nào khác cùng id_product, id_color, id_size không?
      const existingVariant = await Variant.findOne({
        id_product,
        id_color,
        id_size,
        _id: { $ne: id }, // Loại trừ variant hiện tại khỏi kết quả tìm kiếm
      });
      if (existingVariant) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Đã tồn tại màu và kích cỡ ở mã sản phẩm này",
        });
      }

      const variant = await Variant.findByIdAndUpdate(id, value, {
        new: true, // Trả về variant sau khi update
      });
      if (!variant) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy variant" });
      }

      res.status(StatusCodes.OK).json({
        message: "Update variant successfully",
        data: variant,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
  // Cập nhật status của variant
  async updateStatusVariant(req, res) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const variant = await Variant.findById(id);
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy variant",
        });
      }
      variant.status = !variant.status;
      await variant.save();
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật trạng thái variant thành công",
        data: variant,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
  // Cập nhật status của variant
  async removeImageVariant(req, res) {
    try {
      const { id } = req.params;
      const { imageUrl } = req.query;

      const variant = await Variant.findById(id);
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy variant",
        });
      }
      variant.image = variant.image.filter((item) => item !== imageUrl);
      await variant.save();
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật ảnh variant thành công",
        data: variant.image,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}

export default VariantController;
