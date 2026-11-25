import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoreCta } from "@/components/ui";
import { caseStudies, getCaseStudy, nextCaseStudy } from "@/content/case-studies";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return { title: c.title, description: c.summary, openGraph: { title: c.title, description: c.summary } };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();
  const next = nextCaseStudy(slug);
  const { Body } = c;

  return (
    <article>
      <div className="cs-bar wrap">
        <div className="in">
          <Link className="back" href="/#work" aria-label="Back to all work">
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
