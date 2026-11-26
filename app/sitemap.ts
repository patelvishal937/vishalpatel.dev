import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { getPosts } from "@/lib/blog";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["/work", "/about", "/contact", "/blog"].map((p) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...getPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(`${p.date}T00:00:00Z`), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
  return pages;
}
