import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/content/site";

export const alt = `${site.name} · ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return ogImage({ kicker: "Flutter · Full-stack · MCP servers · 3D web", title: site.tagline });
}
