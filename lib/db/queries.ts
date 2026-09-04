import { fallbackStore, getDb, schema } from "./index";
import { eq, desc, asc, and } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const db = getDb();
  if (db) {
    try {
      const result = await db.query.users.findFirst({
        where: eq(schema.users.email, normalizedEmail),
      });
      if (result) return result;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.getUserByEmail(normalizedEmail);
}

export async function getCategories() {
  const db = getDb();
  if (db) {
    try {
      const results = await db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder));
      if (results && results.length > 0) return results;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.getCategories();
}

export async function getCategoryBySlug(slug: string) {
  const db = getDb();
  if (db) {
    try {
      const result = await db.query.categories.findFirst({
        where: eq(schema.categories.slug, slug),
      });
      if (result) return result;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.getCategoryBySlug(slug) || null;
}

export async function getPhotos(filter?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  categoryId?: string;
  categorySlug?: string;
}) {
  const db = getDb();
  if (db) {
    try {
      let conditions = [];
      if (filter?.publishedOnly !== false) {
        conditions.push(eq(schema.photos.published, true));
      }
      if (filter?.featuredOnly) {
        conditions.push(eq(schema.photos.featured, true));
      }
      if (filter?.categoryId) {
        conditions.push(eq(schema.photos.categoryId, filter.categoryId));
      }
      if (filter?.categorySlug) {
        const cat = await getCategoryBySlug(filter.categorySlug);
        if (cat) {
          conditions.push(eq(schema.photos.categoryId, cat.id));
        }
      }

      const results = await db.query.photos.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [asc(schema.photos.displayOrder), desc(schema.photos.createdAt)],
        with: {
          category: true,
        },
      });
      if (results && results.length > 0) return results;
    } catch {
      // Fallback
    }
  }

  const photos = fallbackStore.getPhotos(filter);
  const categories = fallbackStore.getCategories();
  return photos.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.categoryId) || null,
  }));
}

export async function getPhotoBySlug(slug: string) {
  const db = getDb();
  if (db) {
    try {
      const result = await db.query.photos.findFirst({
        where: eq(schema.photos.slug, slug),
        with: {
          category: true,
        },
      });
      if (result) return result;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.getPhotoBySlug(slug);
}

export async function getPhotoById(id: string) {
  const db = getDb();
  if (db) {
    try {
      const result = await db.query.photos.findFirst({
        where: eq(schema.photos.id, id),
        with: {
          category: true,
        },
      });
      if (result) return result;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.getPhotoById(id);
}

export async function getFeaturedPhotos() {
  return getPhotos({ featuredOnly: true, publishedOnly: true });
}

export async function getSiteSettings() {
  const db = getDb();
  if (db) {
    try {
      const result = await db.query.siteSettings.findFirst({
        where: eq(schema.siteSettings.id, "default"),
      });
      if (result) return result;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.getSiteSettings();
}

// Mutating Queries (Used in Admin & Server Actions)
export async function createPhoto(data: schema.NewPhoto) {
  const db = getDb();
  if (db) {
    try {
      const [inserted] = await db.insert(schema.photos).values(data).returning();
      if (inserted) return inserted;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.createPhoto(data);
}

export async function updatePhoto(id: string, data: Partial<schema.NewPhoto>) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db
        .update(schema.photos)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.photos.id, id))
        .returning();
      if (updated) return updated;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.updatePhoto(id, data);
}

export async function deletePhoto(id: string) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.photos).where(eq(schema.photos.id, id));
      return true;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.deletePhoto(id);
}

export async function createCategory(data: schema.NewCategory) {
  const db = getDb();
  if (db) {
    try {
      const [inserted] = await db.insert(schema.categories).values(data).returning();
      if (inserted) return inserted;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.createCategory(data);
}

export async function updateCategory(id: string, data: Partial<schema.NewCategory>) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db
        .update(schema.categories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.categories.id, id))
        .returning();
      if (updated) return updated;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.updateCategory(id, data);
}

export async function deleteCategory(id: string) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(schema.categories).where(eq(schema.categories.id, id));
      return true;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.deleteCategory(id);
}

export async function updateSiteSettings(data: Partial<schema.SiteSettings>) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db
        .insert(schema.siteSettings)
        .values({ id: "default", ...data, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: schema.siteSettings.id,
          set: { ...data, updatedAt: new Date() },
        })
        .returning();
      if (updated) return updated;
    } catch {
      // Fallback
    }
  }
  return fallbackStore.updateSiteSettings(data);
}
