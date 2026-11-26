import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { getPosts } from "@/lib/blog";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${site.updated}T00:00:00Z`);
  const pages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...getPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(`${p.date}T00:00:00Z`), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
  return pages;
}
