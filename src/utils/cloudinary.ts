import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImagetoCloudinary = async (imagePath: string) => {
  try {
    if (!imagePath) {
      return null;
    }
    const res = await cloudinary.uploader.upload(imagePath, {
      folder: "leadlly",
    });
    fs.unlinkSync(imagePath);
    return res.secure_url;
  } catch (error) {
    fs.unlinkSync(imagePath);
    return error;
  }
};

export { uploadImagetoCloudinary };
