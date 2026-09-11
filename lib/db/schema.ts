import { pgTable, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 64 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull().default("Gaurav Damahe"),
    role: varchar("role", { length: 50 }).notNull().default("admin"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
);

export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 64 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("categories_slug_idx").on(table.slug),
    displayOrderIdx: index("categories_display_order_idx").on(table.displayOrder),
  })
);

export const photos = pgTable(
  "photos",
  {
    id: varchar("id", { length: 64 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    imageAlt: varchar("image_alt", { length: 255 }).notNull(),
    categoryId: varchar("category_id", { length: 64 })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    location: varchar("location", { length: 255 }),
    shotAt: varchar("shot_at", { length: 100 }), // e.g. "October 2025"
    cameraSpecs: varchar("camera_specs", { length: 255 }), // e.g. "Canon M50 Mark II"
    aspectRatio: varchar("aspect_ratio", { length: 20 }).notNull().default("4/5"),
    published: boolean("published").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("photos_slug_idx").on(table.slug),
    categoryIdx: index("photos_category_id_idx").on(table.categoryId),
    publishedIdx: index("photos_published_idx").on(table.published),
    displayOrderIdx: index("photos_display_order_idx").on(table.displayOrder),
  })
);

export const siteSettings = pgTable("site_settings", {
  id: varchar("id", { length: 50 }).primaryKey().default("default"),
  photographerName: varchar("photographer_name", { length: 255 }).notNull().default("Gaurav Damahe"),
  tagline: varchar("tagline", { length: 255 }).notNull().default("Stories, framed in light."),
  bio: text("bio").notNull().default("I photograph people, places, and fleeting moments — searching for the quiet details that usually disappear."),
  email: varchar("email", { length: 255 }).notNull().default("gauravxd153@gmail.com"),
  instagram: varchar("instagram", { length: 255 }).notNull().default("https://www.instagram.com/gaurav_unfiltered_"),
  phone: varchar("phone", { length: 100 }).default("+91 9699915638"),
  location: varchar("location", { length: 255 }).notNull().default("Pune / Mumbai, Maharashtra"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  photos: many(photos),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  category: one(categories, {
    fields: [photos.categoryId],
    references: [categories.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
