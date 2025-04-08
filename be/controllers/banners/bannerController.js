import Banners from "../../models/banners/bannerModel";
import StatusCodes from "http-status-codes";
import cloudinary from "cloudinary";

// Cấu hình Cloudinary với biến môi trường đã cho
cloudinary.v2.config({
  cloud_name: "dstqlzxaw",
  api_key: "193663986276182",
  api_secret: "2T_oayqxI-M4kDlbumEdyjaARcg",
});

//  Lấy danh sách banner
export const listBanners = async (req, res) => {
  try {
    const data = await Banners.find().sort({ createdAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Danh sách banner", data });
  } catch (error) {
    console.error("Error listing banners:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

//  Thêm banner mới (chấp nhận URL hoặc file tải lên)
export const addBanner = async (req, res) => {
  try {
    let imageUrl = "";
    let publicId = "";

    // Trường hợp 1: Người dùng gửi URL ảnh (đã tải lên Cloudinary từ frontend)
    if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;

      // Trích xuất publicId từ URL Cloudinary
      try {
        const urlParts = imageUrl.split("/");
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExtension.split(".")[0];

        // Xác định thư mục từ URL (nếu có)
        const uploadIndex = urlParts.indexOf("upload");
        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 1) {
          const folders = urlParts.slice(uploadIndex + 1, urlParts.length - 1);
          if (folders.length > 0) {
            publicId = [...folders, fileName].join("/");
          } else {
            publicId = fileName;
          }
        } else {
          publicId = fileName;
        }
      } catch (error) {
        console.error("Error extracting publicId:", error);
        // Không có publicId vẫn có thể tiếp tục
      }
    }
    // Trường hợp 2: Người dùng tải file lên từ máy tính
    else if (req.file) {
      console.log("File tải lên:", req.file);

      // Upload file buffer lên Cloudinary
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "banners" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          uploadStream.end(req.file.buffer);
        });

        imageUrl = result.secure_url;
        publicId = result.public_id;
      } catch (cloudinaryError) {
        console.error("Error uploading to Cloudinary:", cloudinaryError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Lỗi khi tải ảnh lên Cloudinary: " + cloudinaryError.message,
        });
      }
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng cung cấp ảnh (file hoặc URL)." });
    }

    // Tạo banner mới trong database
    const newBanner = await Banners.create({
      imageUrl,
      publicId,
      status: true, // Mặc định hiển thị
    });

    res.status(StatusCodes.CREATED).json({
      message: "Thêm banner thành công",
      success: true,
      data: newBanner,
    });
  } catch (error) {
    console.error("Add banner error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

//  Xóa banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banners.findById(req.params.id);
    if (!banner) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Banner không tồn tại" });
    }

    // Xóa ảnh trên Cloudinary
    try {
      // Nếu có publicId trong database
      if (banner.publicId) {
        await cloudinary.v2.uploader.destroy(banner.publicId);
      }
      // Nếu không có publicId, thử trích xuất từ URL
      else if (banner.imageUrl && banner.imageUrl.includes("cloudinary.com")) {
        // Lấy public_id từ URL
        const urlParts = banner.imageUrl.split("/");
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const filename = filenameWithExtension.split(".")[0];

        // Xác định thư mục từ URL (nếu có)
        const uploadIndex = urlParts.indexOf("upload");
        let publicId = "";

        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 1) {
          const folders = urlParts.slice(uploadIndex + 1, urlParts.length - 1);
          if (folders.length > 0) {
            publicId = [...folders, filename].join("/");
          } else {
            publicId = filename;
          }
        } else {
          publicId = filename;
        }

        console.log("Attempting to delete with publicId:", publicId);
        await cloudinary.v2.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Vẫn tiếp tục xóa bản ghi trong database ngay cả khi xóa ảnh thất bại
    }

    await Banners.findByIdAndDelete(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa banner thành công" });
  } catch (error) {
    console.error("Delete banner error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

//  Cập nhật trạng thái hiển thị của banner
export const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banners.findById(id);

    if (!banner) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Banner không tồn tại." });
    }

    banner.status = !banner.status;
    await banner.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Banner đã được ${banner.status ? "hiện" : "ẩn"}.`,
      data: banner,
    });
  } catch (error) {
    console.error("Toggle banner status error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};
