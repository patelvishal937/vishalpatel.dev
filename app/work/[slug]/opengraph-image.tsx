import { ogImage, ogSize } from "@/lib/og";
import { caseStudies, getCaseStudy } from "@/content/case-studies";

export const alt = "Case study by Vishal Patel";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug)!;
  return ogImage({ kicker: `Case study · ${c.tag}`, title: c.title });
}
