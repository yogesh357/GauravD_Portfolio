import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { INITIAL_CATEGORIES, INITIAL_PHOTOS, InitialCategory, InitialPhoto } from "./seed-data";

const connectionString = process.env.DATABASE_URL || "";

// In-memory / Fallback store so the entire website and admin functions seamlessly
class FallbackStore {
  private users: (schema.User)[] = [];
  private categories: (schema.Category)[] = [];
  private photos: (schema.Photo)[] = [];
  private siteSettings: schema.SiteSettings = {
    id: "default",
    photographerName: "Gaurav D.",
    tagline: "Stories, framed in light.",
    bio: "I photograph people, places, and fleeting moments — searching for the quiet details that usually disappear. Based between Paris and Tokyo, creating fine-art visual essays and commission editorial works worldwide.",
    email: "gaurav@gauravd.studio",
    instagram: "https://instagram.com/gauravd.photo",
    phone: "+33 (0) 1 42 68 55 00",
    location: "Paris / Tokyo / Worldwide",
    updatedAt: new Date(),
  };

  constructor() {
    this.reset();
  }

  reset() {
    const now = new Date();
    // Default admin user: gaurav@gmail.com / Gaurav@1234
    // Pre-computed bcrypt hash for Gaurav@1234
    this.users = [
      {
        id: "user-admin-1",
        email: "gaurav@gmail.com",
        password: "$2a$10$w09u7i/n0aT.y8L7oU48.eN4L9f1r51HlWjS1xL8O7vA6e1G7zY3W",
        name: "Gaurav D.",
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.categories = INITIAL_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
      createdAt: now,
      updatedAt: now,
    }));

    this.photos = INITIAL_PHOTOS.map((p) => {
      const cat = this.categories.find((c) => c.slug === p.categorySlug);
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        imageUrl: p.imageUrl,
        imageAlt: p.imageAlt,
        categoryId: cat ? cat.id : this.categories[0].id,
        location: p.location,
        shotAt: p.shotAt,
        cameraSpecs: p.cameraSpecs,
        aspectRatio: p.aspectRatio,
        featured: p.featured,
        published: p.published,
        displayOrder: p.displayOrder,
        createdAt: now,
        updatedAt: now,
      };
    });
  }

  getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  createUser(data: schema.NewUser) {
    const id = data.id || `user-${Date.now()}`;
    const now = new Date();
    const newUser: schema.User = {
      id,
      email: data.email,
      password: data.password,
      name: data.name || "Gaurav D.",
      role: data.role || "admin",
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    return newUser;
  }

  getCategories() {
    return [...this.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getCategoryBySlug(slug: string) {
    return this.categories.find((c) => c.slug === slug);
  }

  getPhotos(filter?: { publishedOnly?: boolean; featuredOnly?: boolean; categoryId?: string; categorySlug?: string }) {
    let list = [...this.photos];
    if (filter?.publishedOnly !== false) {
      list = list.filter((p) => p.published);
    }
    if (filter?.featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    if (filter?.categoryId) {
      list = list.filter((p) => p.categoryId === filter.categoryId);
    }
    if (filter?.categorySlug) {
      const cat = this.categories.find((c) => c.slug === filter.categorySlug);
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id);
      }
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getPhotoBySlug(slug: string) {
    const photo = this.photos.find((p) => p.slug === slug);
    if (!photo) return null;
    const category = this.categories.find((c) => c.id === photo.categoryId);
    return { ...photo, category };
  }

  getPhotoById(id: string) {
    const photo = this.photos.find((p) => p.id === id);
    if (!photo) return null;
    const category = this.categories.find((c) => c.id === photo.categoryId);
    return { ...photo, category };
  }

  getSiteSettings() {
    return this.siteSettings;
  }

  createPhoto(data: schema.NewPhoto) {
    const id = data.id || `photo-${Date.now()}`;
    const now = new Date();
    const newPhoto: schema.Photo = {
      id,
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      categoryId: data.categoryId,
      location: data.location ?? null,
      shotAt: data.shotAt ?? null,
      cameraSpecs: data.cameraSpecs ?? null,
      aspectRatio: data.aspectRatio ?? "4/5",
      featured: data.featured ?? false,
      published: data.published ?? true,
      displayOrder: data.displayOrder ?? this.photos.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    this.photos.unshift(newPhoto);
    return newPhoto;
  }

  updatePhoto(id: string, data: Partial<schema.NewPhoto>) {
    const index = this.photos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const existing = this.photos[index];
    const updated: schema.Photo = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.photos[index] = updated;
    return updated;
  }

  deletePhoto(id: string) {
    const index = this.photos.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.photos.splice(index, 1);
    return true;
  }

  createCategory(data: schema.NewCategory) {
    const id = data.id || `cat-${Date.now()}`;
    const now = new Date();
    const newCat: schema.Category = {
      id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      displayOrder: data.displayOrder ?? this.categories.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    this.categories.push(newCat);
    return newCat;
  }

  updateCategory(id: string, data: Partial<schema.NewCategory>) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const existing = this.categories[index];
    const updated: schema.Category = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.categories[index] = updated;
    return updated;
  }

  deleteCategory(id: string) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    return true;
  }

  updateSiteSettings(data: Partial<schema.SiteSettings>) {
    this.siteSettings = {
      ...this.siteSettings,
      ...data,
      updatedAt: new Date(),
    };
    return this.siteSettings;
  }
}

// Global singleton across HMR
declare global {
  // eslint-disable-next-line no-var
  var __globalFallbackStore: FallbackStore | undefined;
  // eslint-disable-next-line no-var
  var __globalDbClient: ReturnType<typeof drizzle<typeof schema>> | null | undefined;
}

export const fallbackStore = global.__globalFallbackStore || new FallbackStore();
if (process.env.NODE_ENV !== "production") {
  global.__globalFallbackStore = fallbackStore;
}

export function getDb() {
  if (global.__globalDbClient !== undefined) {
    return global.__globalDbClient;
  }

  const conn = process.env.DATABASE_URL;
  if (!conn || !conn.startsWith("postgres")) {
    global.__globalDbClient = null;
    return null;
  }

  try {
    const client = postgres(conn, { max: 10, prepare: false });
    const db = drizzle(client, { schema });
    global.__globalDbClient = db;
    return db;
  } catch (err) {
    console.warn("Could not connect to PostgreSQL. Using fallback store.", err);
    global.__globalDbClient = null;
    return null;
  }
}

export const dbClient = getDb();
export { schema };
