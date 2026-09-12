import { getDb, schema } from "./index";
import { eq, desc, asc, and } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const db = getDb();
  return db.query.users.findFirst({
    where: eq(schema.users.email, normalizedEmail),
  });
}

export async function getCategories() {
  const db = getDb();
  return db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.isDeleted, false))
    .orderBy(asc(schema.categories.displayOrder));
}

export async function getCategoryBySlug(slug: string) {
  const db = getDb();
  const result = await db.query.categories.findFirst({
    where: and(
      eq(schema.categories.slug, slug),
      eq(schema.categories.isDeleted, false)
    ),
  });
  return result || null;
}

export async function getCategoryById(id: string) {
  const db = getDb();
  const result = await db.query.categories.findFirst({
    where: and(
      eq(schema.categories.id, id),
      eq(schema.categories.isDeleted, false)
    ),
  });
  return result || null;
}

export async function getPhotos(filter?: {
  publishedOnly?: boolean;
  categoryId?: string;
  categorySlug?: string;
}) {
  const db = getDb();
  const conditions = [eq(schema.photos.isDeleted, false)];

  if (filter?.publishedOnly !== false) {
    conditions.push(eq(schema.photos.published, true));
  }
  if (filter?.categoryId) {
    conditions.push(eq(schema.photos.categoryId, filter.categoryId));
  }
  if (filter?.categorySlug) {
    const cat = await getCategoryBySlug(filter.categorySlug);
    if (cat) {
      conditions.push(eq(schema.photos.categoryId, cat.id));
    } else {
      return [];
    }
  }

  return db.query.photos.findMany({
    where: and(...conditions),
    orderBy: [asc(schema.photos.displayOrder), desc(schema.photos.createdAt)],
    with: {
      category: true,
    },
  });
}

export async function getPhotoBySlug(slug: string) {
  const db = getDb();
  const result = await db.query.photos.findFirst({
    where: and(
      eq(schema.photos.slug, slug),
      eq(schema.photos.isDeleted, false)
    ),
    with: {
      category: true,
    },
  });
  return result || null;
}

export async function getPhotoById(id: string) {
  const db = getDb();
  const result = await db.query.photos.findFirst({
    where: and(
      eq(schema.photos.id, id),
      eq(schema.photos.isDeleted, false)
    ),
    with: {
      category: true,
    },
  });
  return result || null;
}

export async function getSiteSettings() {
  const db = getDb();
  const result = await db.query.siteSettings.findFirst({
    where: eq(schema.siteSettings.id, "default"),
  });
  return (
    result || {
      id: "default",
      photographerName: "Gaurav Damahe",
      tagline: "Stories, framed in light.",
      bio: "I photograph people, places, and fleeting moments — searching for the quiet details that usually disappear.",
      email: "gauravxd153@gmail.com",
      instagram: "https://www.instagram.com/gaurav_unfiltered_",
      phone: "+91 9699915638",
      location: "Pune / Mumbai, Maharashtra",
      updatedAt: new Date(),
    }
  );
}

// Mutating Queries (Used in Admin & Server Actions)
export async function createPhoto(data: schema.NewPhoto) {
  const db = getDb();
  const [inserted] = await db.insert(schema.photos).values(data).returning();
  return inserted;
}

export async function updatePhoto(id: string, data: Partial<schema.NewPhoto>) {
  const db = getDb();
  const [updated] = await db
    .update(schema.photos)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.photos.id, id))
    .returning();
  return updated;
}

export async function deletePhoto(id: string) {
  const db = getDb();
  await db
    .update(schema.photos)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.photos.id, id));
  return true;
}

export async function createCategory(data: schema.NewCategory) {
  const db = getDb();
  const [inserted] = await db.insert(schema.categories).values(data).returning();
  return inserted;
}

export async function updateCategory(id: string, data: Partial<schema.NewCategory>) {
  const db = getDb();
  const [updated] = await db
    .update(schema.categories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.categories.id, id))
    .returning();
  return updated;
}

export async function deleteCategory(id: string) {
  const db = getDb();
  const now = new Date();
  await db
    .update(schema.categories)
    .set({
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(schema.categories.id, id));

  // Cascade soft delete to all photos belonging to this category
  await db
    .update(schema.photos)
    .set({
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(schema.photos.categoryId, id));

  return true;
}

export async function updateSiteSettings(data: Partial<schema.SiteSettings>) {
  const db = getDb();
  const [updated] = await db
    .insert(schema.siteSettings)
    .values({ id: "default", ...data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.siteSettings.id,
      set: { ...data, updatedAt: new Date() },
    })
    .returning();
  return updated;
}
