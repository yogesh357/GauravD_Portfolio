# Gaurav Damahe — Fine Art & Editorial Photographer Portfolio & Studio CMS

A bespoke, production-ready editorial portfolio website and studio content management system built for professional fine-art and commercial photographers. Designed with an intentional, photography-first aesthetic inspired by high-end contemporary art galleries, luxury magazines, and cinematic visual pacing.

---

## 📸 Key Features

- **Editorial Visual Language**: Warm ivory paper canvas (`#F4F1EB`), deep carbon typography (`#111111`), muted warm bronze accents, and elegant typography pairing (`Cormorant Garamond` display serif + `Inter` clean sans).
- **GSAP & @gsap/react Motion Engine**: Smooth clip-path reveals (`inset(100% 0 0 0)` → `inset(0 0 0 0)`), subtle scroll-driven parallax, word-staggered headline reveals, and floating navigation dock morphing with automatic `prefers-reduced-motion` compliance.
- **Relational PostgreSQL / Neon Architecture**: Normalized schema modeled with **Drizzle ORM** (`categories`, `photos`, `site_settings`), foreign keys, and indexes on slugs, categories, display order, and publishing status.
- **Abstracted Image Storage Layer**: Decoupled interface (`lib/storage/index.ts`) supporting direct Cloudinary CDN stream buffer uploads as well as local filesystem uploads (`/public/uploads`).
- **Dynamic Category Filter & Gallery Showcase**: Database-driven category tabs (`All`, `Portraits`, `Architecture`, `Landscapes`, `Street`, `Editorial`, `Travel`) with smooth GSAP transition animations and zero layout shifts.
- **Cinematic Photo Detail Pages (`/work/[slug]`)**: Full-bleed responsive high-resolution presentation, detailed technical EXIF metadata (Camera, Lens, Aperture, ISO, Coordinates, Date), previous/next navigation, and dynamic OpenGraph/Twitter SEO tags.
- **Studio Content Management System (`/admin`)**:
  - `/admin`: Dashboard with live metrics (total photos, published, drafts, categories, storage status).
  - `/admin/photos`: Catalog inventory with live search, category filtering, instant publish toggles, and deletion.
  - `/admin/photos/new` & `/admin/photos/[id]`: Photo creator/editor with direct drag-and-drop Cloudinary/local upload, automatic slug generator, camera EXIF fields, aspect ratio selection, and live preview.
  - `/admin/categories`: Category taxonomy manager with display order prioritization.
  - `/admin/settings`: Studio configuration (photographer wordmark, tagline, artist bio, email, Instagram, international studio locations).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components & Server Actions) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS with bespoke fine-art tokens |
| **Animation** | GSAP 3 + `@gsap/react` + `ScrollTrigger` |
| **Database** | PostgreSQL (Neon serverless compatible) |
| **ORM** | Drizzle ORM + Drizzle Kit |
| **Cloud Storage** | Cloudinary + Local Storage fallback |
| **Validation** | Zod (Client and Server-side enforcement) |
| **Icons** | Lucide React |

---

## 🚀 Quick Start & Setup Instructions

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Neon / PostgreSQL database URL
DATABASE_URL="postgresql://neondb_owner:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Secret for Session Signing
JWT_SECRET="gauravd-secure-jwt-secret-key-2026-studio-art"

# Default Admin Credentials (Seeded into Database)
# Email: gauravxd153@gmail.com
# Password: GCOEARA_cha_ladaka_gaurav

# Public site settings
NEXT_PUBLIC_SITE_NAME="Gaurav Damahe — Visual Artist & Photographer"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Optional: Cloudinary Storage (if using remote CDN upload)
# CLOUDINARY_CLOUD_NAME="your-cloud-name"
# CLOUDINARY_API_KEY="your-api-key"
# CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Migration & Seed

To push schema migrations to your PostgreSQL/Neon database:

```bash
# Push schema to PostgreSQL
npm run db:push

# Seed the database with 16 curated high-res editorial photographs
npm run db:seed
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Studio CMS.

### 5. Production Build

```bash
npm run build
npm run start
```

---

## 🖼️ Abstracted Image Storage Architecture

All photograph URLs and metadata are stored in PostgreSQL without embedding raw binaries. The storage layer in `lib/storage/index.ts` exposes a clean interface:

```typescript
export interface StorageProvider {
  name: string;
  upload(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(fileUrl: string): Promise<boolean>;
}
```

1. **Local Storage Provider (Default / Zero-Cost)**: Saves uploaded files to `/public/uploads/` and serves them directly through Next.js.
2. **Cloudinary / S3 Provider (Pluggable)**: Automatically activates when `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_KEY` are defined in `.env.local`.

---

## 🎭 GSAP Animation Architecture

GSAP animations are integrated using `@gsap/react` (`useGSAP`) with strict context isolation to prevent memory leaks and hydration mismatches.

- **Clip-Path Reveals**: `EditorialReveal.tsx` utilizes `clip-path: inset(100% 0% 0% 0%)` transitioning to `clip-path: inset(0% 0% 0% 0%)` on scroll entry.
- **Scroll-Morphing Navbar**: Listens to scroll position and transitions from a transparent top overlay into a floating frosted dock with hairline border.
- **Parallax Imagery**: Uses ScrollTrigger with smooth scrub (`scrub: 1.2`) for layered visual depth.
- **Accessibility**: Automatically checks `prefers-reduced-motion` and scales timeline transitions to instant when requested by the operating system.

---

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with Cormorant Garamond font & GSAP provider
│   ├── page.tsx                # Dynamic editorial homepage (Server Component)
│   ├── globals.css             # Fine-art theme tokens and scrollbar styles
│   ├── sitemap.ts              # Dynamic sitemap generator
│   ├── robots.ts               # Search engine crawl rules
│   ├── not-found.tsx           # Editorial 404 page
│   ├── work/[slug]/page.tsx    # Photo detail route with EXIF and related works
│   ├── admin/
│   │   ├── layout.tsx          # Studio CMS navigation shell
│   │   ├── page.tsx            # CMS Dashboard and metrics
│   │   ├── actions.ts          # Zod-validated Server Actions for photos/categories
│   │   ├── photos/page.tsx     # Photo catalog table
│   │   ├── photos/new/page.tsx # Photo registration form
│   │   ├── photos/[id]/page.tsx# Photo editor
│   │   ├── categories/page.tsx # Category taxonomy management
│   │   └── settings/page.tsx   # Studio profile & contact configuration
│   └── api/upload/route.ts     # Abstracted image upload endpoint
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Scroll-morphing navbar with mobile drawer
│   │   └── Footer.tsx          # Studio world clocks and colophon
│   ├── sections/
│   │   ├── Hero.tsx            # Cinematic hero with clip-path reveal
│   │   ├── ArtistStatement.tsx # Editorial philosophy with staggered reveal
│   │   ├── FeaturedWork.tsx    # Asymmetric editorial portfolio grid
│   │   ├── PortfolioGrid.tsx   # Dynamic category filter and gallery
│   │   ├── SelectedStory.tsx   # Immersive dark visual essay
│   │   ├── AboutPhotographer.tsx# Bio, exhibition history, client list
│   │   └── ContactSection.tsx  # Commission dialogue form & studio addresses
│   ├── animations/
│   │   ├── GsapProvider.tsx    # GSAP plugin initialization & reduced-motion check
│   │   └── EditorialReveal.tsx # Reusable scroll reveal component
│   └── admin/
│       ├── PhotosTable.tsx     # Interactive photo catalog with live search
│       ├── PhotoForm.tsx       # Photo creator/editor with live preview
│       ├── CategoriesManager.tsx# Category manager with in-place editing
│       └── SettingsForm.tsx    # Studio configuration form
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle PostgreSQL schema
│   │   ├── queries.ts          # Typed query repository
│   │   ├── seed-data.ts        # 16 curated high-res fine-art photographs
│   │   ├── seed.ts             # Standalone DB seeding script
│   │   └── index.ts            # PostgreSQL client & resilient fallback engine
│   ├── storage/
│   │   └── index.ts            # Abstracted storage provider interface
│   ├── validations/
│   │   └── index.ts            # Zod validation schemas
│   └── utils.ts                # Tailwind merge and slug utilities
├── drizzle.config.ts           # Drizzle Kit configuration
├── tailwind.config.ts          # Editorial theme palette and typography
└── package.json                # Dependencies and project scripts
```
