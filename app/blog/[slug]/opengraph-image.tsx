import { ogImage, ogSize } from "@/lib/og";
import { getPost, getPosts } from "@/lib/blog";

export const alt = "Post by Vishal Patel";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug)!;
  return ogImage({ kicker: "Notes from shipping", title: p.title });
}
