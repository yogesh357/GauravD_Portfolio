import { MetadataRoute } from "next";
import { getPhotos } from "@/lib/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gauravd.studio";
  const photos = await getPhotos({ publishedOnly: true });

  const photoEntries: MetadataRoute.Sitemap = photos.map((photo) => ({
    url: `${baseUrl}/work/${photo.slug}`,
    lastModified: new Date(photo.updatedAt || new Date()),
    changeFrequency: "monthly",
    priority: photo.featured ? 0.9 : 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...photoEntries,
  ];
}
