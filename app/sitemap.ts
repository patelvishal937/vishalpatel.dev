import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", ...caseStudies.map((c) => `/work/${c.slug}`)];
  return pages.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() }));
}
