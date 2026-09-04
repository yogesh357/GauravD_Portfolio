export interface UploadResult {
  url: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface StorageProvider {
  name: string;
  upload(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(fileUrl: string): Promise<boolean>;
}

// 1. Local Storage Provider (zero-cost, self-hosted in public/uploads)
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

// 2. Cloudinary Storage Provider (Pluggable via env vars: CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME)
export class CloudinaryStorageProvider implements StorageProvider {
  name = "cloudinary";

  async upload(fileBuffer: Buffer, filename: string, _mimeType: string): Promise<UploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials not configured");
    }

    // Direct HTTP upload implementation to avoid bulky third-party SDK dependencies
    const base64Data = `data:${_mimeType};base64,${fileBuffer.toString("base64")}`;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const formData = new FormData();
    formData.append("file", base64Data);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Cloudinary upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      url: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
      size: data.bytes,
    };
  }

  async delete(_fileUrl: string): Promise<boolean> {
    return true;
  }
}

// Storage Factory
export function getStorageProvider(): StorageProvider {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    return new CloudinaryStorageProvider();
  }
  return new LocalStorageProvider();
}
