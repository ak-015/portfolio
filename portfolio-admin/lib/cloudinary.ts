import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Admin is the only app that ever uploads. Called from /api/upload with a
// base64 data URL from the browser file input; returns the secure_url that
// gets stored directly in a PendingChange payload's *ImageUrl field.
export async function uploadImage(dataUrl: string, folder: string) {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: `portfolio/${folder}`,
    resource_type: "image",
    overwrite: false,
  });
  return result.secure_url;
}

export async function uploadRaw(dataUrl: string, folder: string, publicId?: string) {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: `portfolio/${folder}`,
    resource_type: "auto",
    public_id: publicId,
    overwrite: true,
  });
  return result.secure_url;
}
