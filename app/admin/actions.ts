"use server";

import { revalidatePath } from "next/cache";
import { photoSchema, categorySchema, siteSettingsSchema } from "@/lib/validations";
import {
  createPhoto,
  updatePhoto,
  deletePhoto,
  createCategory,
  updateCategory,
  deleteCategory,
  updateSiteSettings,
} from "@/lib/db/queries";

export async function savePhotoAction(formData: FormData) {
  try {
    const id = (formData.get("id") as string) || undefined;
    const rawData = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || "",
      description: (formData.get("description") as string) || null,
      imageUrl: formData.get("imageUrl") as string,
      imageAlt: (formData.get("imageAlt") as string) || formData.get("title") as string,
      categoryId: formData.get("categoryId") as string,
      location: (formData.get("location") as string) || null,
      shotAt: (formData.get("shotAt") as string) || null,
      cameraSpecs: (formData.get("cameraSpecs") as string) || null,
      aspectRatio: (formData.get("aspectRatio") as "4/5" | "16/10" | "3/4" | "1/1" | "2/3") || "4/5",
      featured: formData.get("featured") === "true" || formData.get("featured") === "on",
      published: formData.get("published") === "true" || formData.get("published") === "on",
      displayOrder: Number(formData.get("displayOrder") || 0),
    };

    const validated = photoSchema.parse(rawData);

    if (id) {
      await updatePhoto(id, validated);
    } else {
      await createPhoto(validated);
    }

    revalidatePath("/");
    revalidatePath("/work/[slug]", "page");
    revalidatePath("/admin");
    revalidatePath("/admin/photos");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Validation failed";
    return { success: false, error: message };
  }
}

export async function deletePhotoAction(id: string) {
  try {
    await deletePhoto(id);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/photos");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return { success: false, error: message };
  }
}

export async function togglePublishAction(id: string, currentStatus: boolean) {
  try {
    const nextStatus = !currentStatus;
    await updatePhoto(id, { published: nextStatus });
    revalidatePath("/");
    revalidatePath("/admin/photos");
    return { success: true, newStatus: nextStatus };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Toggle failed";
    return { success: false, error: message };
  }
}

export async function toggleFeaturedAction(id: string, currentStatus: boolean) {
  try {
    const nextStatus = !currentStatus;
    await updatePhoto(id, { featured: nextStatus });
    revalidatePath("/");
    revalidatePath("/admin/photos");
    return { success: true, newStatus: nextStatus };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Toggle failed";
    return { success: false, error: message };
  }
}

export async function saveCategoryAction(formData: FormData) {
  try {
    const id = (formData.get("id") as string) || undefined;
    const rawData = {
      name: formData.get("name") as string,
      slug: (formData.get("slug") as string) || "",
      description: (formData.get("description") as string) || null,
      displayOrder: Number(formData.get("displayOrder") || 0),
    };

    const validated = categorySchema.parse(rawData);

    if (id) {
      await updateCategory(id, validated);
    } else {
      await createCategory(validated);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Category validation failed";
    return { success: false, error: message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory(id);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Category delete failed";
    return { success: false, error: message };
  }
}

export async function updateSettingsAction(formData: FormData) {
  try {
    const rawData = {
      photographerName: formData.get("photographerName") as string,
      tagline: formData.get("tagline") as string,
      bio: formData.get("bio") as string,
      email: formData.get("email") as string,
      instagram: formData.get("instagram") as string,
      phone: (formData.get("phone") as string) || null,
      location: formData.get("location") as string,
    };

    const validated = siteSettingsSchema.parse(rawData);
    await updateSiteSettings(validated);

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Settings update failed";
    return { success: false, error: message };
  }
}
