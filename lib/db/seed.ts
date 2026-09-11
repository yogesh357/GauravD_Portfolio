import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";
import { INITIAL_CATEGORIES, INITIAL_PHOTOS } from "./seed-data";

dotenv.config({ path: ".env.local" });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No DATABASE_URL found in .env.local.");
    process.exit(1);
  }

  console.log("Connecting to PostgreSQL/Neon...");
  const sqlClient = postgres(connectionString, { max: 1 });
  const db = drizzle(sqlClient, { schema });

  console.log("Ensuring database tables match schema...");
  await sqlClient`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL DEFAULT 'Gaurav Damahe',
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  await sqlClient`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  await sqlClient`
    CREATE TABLE IF NOT EXISTS photos (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      image_alt VARCHAR(255) NOT NULL,
      category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      location VARCHAR(255),
      shot_at VARCHAR(100),
      camera_specs VARCHAR(255),
      aspect_ratio VARCHAR(20) NOT NULL DEFAULT '4/5',
      published BOOLEAN NOT NULL DEFAULT true,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  // Remove featured column if it existed previously
  await sqlClient`
    ALTER TABLE photos DROP COLUMN IF EXISTS featured;
  `;

  await sqlClient`
    CREATE TABLE IF NOT EXISTS site_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
      photographer_name VARCHAR(255) NOT NULL DEFAULT 'Gaurav Damahe',
      tagline VARCHAR(255) NOT NULL DEFAULT 'Stories, framed in light.',
      bio TEXT NOT NULL DEFAULT 'I photograph people, places, and fleeting moments — searching for the quiet details that usually disappear.',
      email VARCHAR(255) NOT NULL DEFAULT 'gauravxd153@gmail.com',
      instagram VARCHAR(255) NOT NULL DEFAULT 'https://www.instagram.com/gaurav_unfiltered_',
      phone VARCHAR(100) DEFAULT '+91 9699915638',
      location VARCHAR(255) NOT NULL DEFAULT 'Pune / Mumbai, Maharashtra',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  console.log("Wiping existing dataset for a clean reset...");
  await sqlClient`TRUNCATE TABLE photos, categories, site_settings, users CASCADE;`;

  console.log("Seeding admin user...");
  // ========================================================
  // Default admin user credentials:
  // Email: gauravxd153@gmail.com
  // Unhashed Password: GCOEARA_cha_ladaka_gaurav
  // ========================================================
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash("GCOEARA_cha_ladaka_gaurav", 10);

  await db.insert(schema.users).values({
    id: "user-admin-1",
    email: "gauravxd153@gmail.com",
    password: hashedPassword,
    name: "Gaurav Damahe",
    role: "admin",
  });

  console.log("Seeding categories...");
  for (const cat of INITIAL_CATEGORIES) {
    await db.insert(schema.categories).values({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
    });
  }

  console.log("Seeding photos...");
  for (const p of INITIAL_PHOTOS) {
    await db.insert(schema.photos).values({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      imageUrl: p.imageUrl,
      imageAlt: p.imageAlt,
      categoryId: `cat-${p.categorySlug}`,
      location: p.location,
      shotAt: p.shotAt,
      cameraSpecs: p.cameraSpecs,
      aspectRatio: p.aspectRatio,
      published: p.published,
      displayOrder: p.displayOrder,
    });
  }

  console.log("Seeding site settings with Gaurav Damahe contact data...");
  await db.insert(schema.siteSettings).values({
    id: "default",
    photographerName: "Gaurav Damahe",
    tagline: "Stories, framed in light.",
    bio: "I photograph people, places, and fleeting moments — searching for the quiet details that usually disappear. Documenting Maharashtra culture, street, portraits, and fine-art visual essays.",
    email: "gauravxd153@gmail.com",
    instagram: "https://www.instagram.com/gaurav_unfiltered_",
    phone: "+91 9699915638",
    location: "Pune / Mumbai, Maharashtra",
  });

  console.log("Database seeded successfully with clean PostgreSQL data!");
  await sqlClient.end();
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
