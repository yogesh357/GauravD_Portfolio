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
  return db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder));
}

export async function getCategoryBySlug(slug: string) {
  const db = getDb();
  const result = await db.query.categories.findFirst({
    where: eq(schema.categories.slug, slug),
  });
  return result || null;
}

export async function getPhotos(filter?: {
  publishedOnly?: boolean;
  categoryId?: string;
  categorySlug?: string;
}) {
  const db = getDb();
  const conditions = [];

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
    }
  }

  return db.query.photos.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [asc(schema.photos.displayOrder), desc(schema.photos.createdAt)],
    with: {
      category: true,
    },
  });
}

export async function getPhotoBySlug(slug: string) {
  const db = getDb();
  const result = await db.query.photos.findFirst({
    where: eq(schema.photos.slug, slug),
    with: {
      category: true,
    },
  });
  return result || null;
}

export async function getPhotoById(id: string) {
  const db = getDb();
  const result = await db.query.photos.findFirst({
    where: eq(schema.photos.id, id),
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
  await db.delete(schema.photos).where(eq(schema.photos.id, id));
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
  await db.delete(schema.categories).where(eq(schema.categories.id, id));
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
