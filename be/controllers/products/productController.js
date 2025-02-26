import Product from "../../models/products/product";
import StatusCodes from "http-status-codes";
import slugify from "slugify";
import { productValidator } from "../../utils/validator/product";
import Variant from "../../models/variants/variants";

class ProductController {
	// Get all products
	async getAllProducts(req, res) {
		try {
			const { _page = 1, _limit = 10, _embed, key = "" } = req.query;

			const options = {
				page: parseInt(_page, 10),
				limit: parseInt(_limit, 10),
			};

			let query = {};

			if (key) {
				const lowerCaseKey = key.toLowerCase();
				query.name = { $regex: lowerCaseKey, $options: "i" };
			}

			let productQuery = Product.find(query);

			if (_embed) {
				const embeds = _embed.split(",");
				embeds.forEach((embed) => {
					productQuery = productQuery.populate(embed);
				});
			}

			productQuery = productQuery.sort({ createdAt: -1 });

			const result = await Product.paginate(productQuery, options);
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
			// console.log("1");
			const product = await Product.findById(id).populate("id_cate");
			// console.log("products" + product);

			if (!product) {
				return res.status(StatusCodes.NOT_FOUND).json({
					message: "Không tìm thấy sản phẩm",
				});
			}
			return res.status(StatusCodes.OK).json({
				message: "Lấy thông tin sản phẩm thành công",
				data: product,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}
	// Get products by id_cate
	async getproductsbyCate_id(req, res) {
		try {
			const { _page = 1, _limit = 10 } = req.query;
			const { id_cate } = req.params;
			// console.log(`id_cate: ${id_cate}`);
			const options = {
				page: parseInt(_page, 10),
				limit: parseInt(_limit, 10),
			};
			let query = Product.find({ id_cate: id_cate }).populate("id_cate", "name");

			query = query.sort({ createdAt: -1 });

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
			const { error, value } = productValidator.validate(req.body, {
				abortEarly: false,
			});
			if (error) {
				return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
			}
			const { name } = value;
			// Kiểm tra xem sản phẩm với tên này đã tồn tại chưa
			const existingProduct = await Product.findOne({ name });
			if (existingProduct) {
				return res.status(StatusCodes.BAD_REQUEST).json({ message: "Sản phẩm với tên này đã tồn tại" });
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
				return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
			}
			// console.log(value);
			const { id } = req.params;
			// Tạo slug từ name nếu name có trong dữ liệu cập nhật
			if (value.name) {
				const existingProduct = await Product.findOne({
					name: value.name,
					_id: { $ne: id }, // Loại trừ sản phẩm hiện tại khỏi kết quả tìm kiếm
				});
				if (existingProduct) {
					return res.status(StatusCodes.BAD_REQUEST).json({ message: "Tên sản phẩm đã tồn tại" });
				}
			}
			const product = await Product.findByIdAndUpdate(id, value, {
				new: true, // Trả về sản phẩm sau khi update
			});
			if (!product) {
				return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy sản phẩm" });
			}
			res.status(StatusCodes.OK).json(product);
		} catch (error) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: error.message,
			});
		}
	}

	// Cập nhật status của product
	async updateStatusProduct(req, res) {
		try {
			const { id } = req.params;
			const product = await Product.findById(id);
			if (!product) {
				return res.status(StatusCodes.NOT_FOUND).json({
					message: "Không tìm thấy sản phẩm",
				});
			}
			product.status = !product.status;
			await product.save();

			return res.status(StatusCodes.OK).json({
				message: "Cập nhật trạng thái sản phẩm thành công",
				data: product,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}

	async getProductWithConditions(req, res) {
		try {
			const { cate, size, color, priceMin, priceMax } = req.query;
			let queryProduct = { status: true };
			if (cate) {
				const cateArray = Array.isArray(cate) ? cate : cate.split(",");
				queryProduct = {
					...queryProduct,
					id_cate: { $in: cateArray },
				};
			}
			if (priceMin || priceMax) {
				queryProduct = {
					...queryProduct,
					price: {},
				};
				if (priceMin) queryProduct.price.$gte = Number(priceMin);
				if (priceMax) queryProduct.price.$lte = Number(priceMax);
			}
			let queryVariants = { status: true };
			if (color) {
				const colorArray = Array.isArray(color) ? color : color.split(",");
				queryVariants = {
					...queryVariants,
					id_color: { $in: colorArray },
				};
			}
			if (size) {
				const sizeArray = Array.isArray(size) ? size : size.split(",");
				queryVariants = {
					...queryVariants,
					id_size: { $in: sizeArray },
				};
			}
			const products = await Product.find(queryProduct).lean();
			const productIds = products.map((item) => item._id);
			const variants = await Variant.find({ id_product: { $in: productIds }, ...queryVariants });
			const productsWithVariants = products.map((product) => {
				return {
					...product,
					variants: variants.filter(
						(itemVariant) => itemVariant.id_product.toString() === product._id.toString()
					),
				};
			});
			let filteredData = productsWithVariants;
			if (color || size) {
				filteredData = filteredData.filter((item) => item.variants.length > 0);
			}
			return res.status(StatusCodes.OK).json({
				message: "Lọc danh sách sản phẩm thành công",
				total: filteredData.length,
				content: {
					products: filteredData,
				},
			});
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: error.message,
			});
		}
	}
}

export default ProductController;
