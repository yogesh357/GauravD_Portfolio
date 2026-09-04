import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";
import { INITIAL_CATEGORIES, INITIAL_PHOTOS } from "./seed-data";

dotenv.config({ path: ".env.local" });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("No DATABASE_URL found. Initializing with local memory seed.");
    return;
  }

  console.log("Connecting to PostgreSQL/Neon...");
  const sqlClient = postgres(connectionString, { max: 1 });
  const db = drizzle(sqlClient, { schema });

  console.log("Ensuring users table exists...");
  await sqlClient`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL DEFAULT 'Gaurav D.',
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  console.log("Seeding admin user...");
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash("Gaurav@1234", 10);
  await db
    .insert(schema.users)
    .values({
      id: "user-admin-1",
      email: "gaurav@gmail.com",
      password: hashedPassword,
      name: "Gaurav D.",
      role: "admin",
    })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

  console.log("Seeding categories...");
  for (const cat of INITIAL_CATEGORIES) {
    await db
      .insert(schema.categories)
      .values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding photos...");
  for (const p of INITIAL_PHOTOS) {
    await db
      .insert(schema.photos)
      .values({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        imageUrl: p.imageUrl,
        imageAlt: p.imageAlt,
        categoryId: p.id.startsWith("cat-") ? p.id : `cat-${p.categorySlug}`,
        location: p.location,
        shotAt: p.shotAt,
        cameraSpecs: p.cameraSpecs,
        aspectRatio: p.aspectRatio,
        featured: p.featured,
        published: p.published,
        displayOrder: p.displayOrder,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding site settings...");
  await db
    .insert(schema.siteSettings)
    .values({
      id: "default",
      photographerName: "Gaurav D.",
      tagline: "Stories, framed in light.",
      bio: "I photograph people, places, and fleeting moments — searching for the quiet details that usually disappear.",
      email: "gaurav@gauravd.studio",
      instagram: "https://instagram.com/gauravd.photo",
      phone: "+33 (0) 1 42 68 55 00",
      location: "Paris / Tokyo / Worldwide",
    })
    .onConflictDoNothing();

  console.log("Database seeded successfully!");
  await sqlClient.end();
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
