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
function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  if (cloudinaryUrl) {
    try {
      const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
      if (match) {
        return {
          cloud_name: match[3].replace(/^\/+/, ""),
          api_key: match[1],
          api_secret: match[2],
          secure: true,
        };
      }
      const parsed = new URL(cloudinaryUrl);
      if (parsed.username && parsed.password && parsed.hostname) {
        return {
          cloud_name: parsed.hostname,
          api_key: parsed.username,
          api_secret: parsed.password,
          secure: true,
        };
      }
    } catch {
      // continue to individual credentials check
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    return {
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    };
  }

  return null;
}

export class CloudinaryStorageProvider implements StorageProvider {
  name = "cloudinary";

  constructor() {
    const config = getCloudinaryConfig();
    if (config) {
      cloudinary.config(config);
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
          overwrite: true,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            const msg = error?.message || "Cloudinary upload failed";
            if (error?.http_code === 403 || msg.includes("403")) {
              reject(
                new Error(
                  "Cloudinary returned HTTP 403 (Invalid credentials or unauthorized). Please verify your CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env."
                )
              );
              return;
            }
            reject(new Error(msg));
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
  const config = getCloudinaryConfig();
  if (config) {
    return new CloudinaryStorageProvider();
  }
  return new LocalStorageProvider();
}
