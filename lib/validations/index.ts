import { z } from "zod";

export const photoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Please provide a valid image URL or upload a file"),
  imageAlt: z.string().min(3, "Image alt text is required for accessibility"),
  categoryId: z.string().min(1, "Category is required"),
  location: z.string().max(255).optional().nullable(),
  shotAt: z.string().max(100).optional().nullable(),
  cameraSpecs: z.string().max(255).optional().nullable(),
  aspectRatio: z.enum(["4/5", "16/10", "3/4", "1/1", "2/3"]).default("4/5"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes"),
  description: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
});

export const siteSettingsSchema = z.object({
  photographerName: z.string().min(2).max(255),
  tagline: z.string().min(2).max(255),
  bio: z.string().min(10),
  email: z.string().email(),
  instagram: z.string().url(),
  phone: z.string().optional().nullable(),
  location: z.string().min(2).max(255),
});

export type PhotoInput = z.infer<typeof photoSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
