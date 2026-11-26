import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoreCta } from "@/components/ui";
import { caseStudies, getCaseStudy, nextCaseStudy } from "@/content/case-studies";
import { site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: { type: "article", title: c.seo.title, description: c.seo.description, url: `/work/${c.slug}` },
    twitter: { card: "summary_large_image", title: c.seo.title, description: c.seo.description },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();
  const next = nextCaseStudy(slug);
  const { Body } = c;
  const url = `${site.url}/work/${c.slug}`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: c.title,
      headline: c.seo.title,
      description: c.seo.description,
      url,
      author: { "@id": `${site.url}/#person` },
      creator: { "@id": `${site.url}/#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/work` },
        { "@type": "ListItem", position: 3, name: c.title, item: url },
      ],
    },
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="cs-bar wrap">
        <div className="in">
          <Link className="back" href="/work" aria-label="Back to all work">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5m6-6-6 6 6 6" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="wrap">
        <header className="cs-head">
          <h1>{c.title}</h1>
          <p>{c.tag}</p>
        </header>
        <div className="hero">
          {c.hero}
        </div>
        <dl className="meta">
          {c.meta.map((m) => (
            <div key={m.label}>
              <dt><b>{m.label}</b></dt>
              <dd style={{ margin: 0 }}><span>{m.value}</span></dd>
            </div>
          ))}
        </dl>
        <Body />
      </div>
      <MoreCta />
      <div className="wrap">
        <nav className="next" aria-label="Next case study">
          <span>Next case study</span>
          <Link href={`/work/${next.slug}`}>{next.title} →</Link>
        </nav>
      </div>
    </article>
  );
}
