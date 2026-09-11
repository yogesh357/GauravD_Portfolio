import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export interface UploadResult {
  url: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  publicId?: string;
}

export interface StorageProvider {
  name: string;
  upload(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(fileUrl: string): Promise<boolean>;
}

// 1. Local Storage Provider (zero-cost, self-hosted in public/uploads fallback)
export class LocalStorageProvider implements StorageProvider {
  name = "local";

  async upload(fileBuffer: Buffer, filename: string, _mimeType: string): Promise<UploadResult> {
    const fs = await import("fs/promises");
    const path = await import("path");

    const sanitizedName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, sanitizedName);
    await fs.writeFile(filePath, fileBuffer);

    return {
      url: `/uploads/${sanitizedName}`,
      size: fileBuffer.length,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    if (!fileUrl.startsWith("/uploads/")) return false;
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const filename = fileUrl.replace("/uploads/", "");
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// 2. Cloudinary Storage Provider (via official Cloudinary SDK)
export class CloudinaryStorageProvider implements StorageProvider {
  name = "cloudinary";

  constructor() {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
      });
    } else {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }
  }

  async upload(fileBuffer: Buffer, filename: string, _mimeType: string): Promise<UploadResult> {
    const baseName = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "gaurav_photography",
          public_id: `${Date.now()}_${baseName}`,
          resource_type: "image",
          transformation: [{ quality: "auto:best" }],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(new Error(error?.message || "Cloudinary upload failed"));
            return;
          }
          resolve({
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      // Extract public_id if from Cloudinary
      if (!fileUrl.includes("res.cloudinary.com")) return false;
      const parts = fileUrl.split("/");
      const uploadIndex = parts.indexOf("upload");
      if (uploadIndex === -1) return false;
      
      const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch {
      return false;
    }
  }
}

// Storage Factory
export function getStorageProvider(): StorageProvider {
  const hasCloudinaryEnv =
    !!process.env.CLOUDINARY_URL ||
    (!!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET);

  if (hasCloudinaryEnv) {
    return new CloudinaryStorageProvider();
  }
  return new LocalStorageProvider();
}
