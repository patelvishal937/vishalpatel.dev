import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoreCta } from "@/components/ui";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.seoTitle,
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", url: `/blog/${p.slug}`, title: p.seoTitle, description: p.description, publishedTime: p.date, authors: [site.name] },
    twitter: { card: "summary_large_image", title: p.seoTitle, description: p.description },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const others = getPosts().filter((x) => x.slug !== p.slug).slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    keywords: p.keywords.join(", "),
    mainEntityOfPage: `${site.url}/blog/${p.slug}`,
    author: { "@type": "Person", "@id": `${site.url}/#person`, name: site.name, url: site.url },
    publisher: { "@id": `${site.url}/#person` },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: p.seoTitle, item: `${site.url}/blog/${p.slug}` },
    ],
  };

  return (
    <article className="blog">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]).replace(/</g, "\\u003c") }} />
      <div className="cs-bar wrap">
        <div className="in">
          <Link className="back" href="/blog" aria-label="Back to all posts">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5m6-6-6 6 6 6" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="wrap">
        <header className="cs-head post-head">
          <h1>{p.title}</h1>
          <p>
            {site.name} · <time dateTime={p.date}>{formatDate(p.date)}</time> · {p.readMins} min read
          </p>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
        <aside className="post-author">
          <b>{site.name}</b>
          <span>
            {site.role} in {site.location}. I ship Flutter apps, full-stack products and MCP servers. Open to remote AI, full-stack and mobile
            roles. <Link href="/work">See my work</Link> · <a href={site.resume} target="_blank" rel="noopener noreferrer">Resume</a>
          </span>
        </aside>
        {others.length ? (
          <nav className="post-more" aria-label="More posts">
            <span>More notes</span>
            {others.map((o) => (
              <Link key={o.slug} href={`/blog/${o.slug}`}>
                {o.title} →
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      <MoreCta title="Hiring for AI, full-stack or mobile?" text="I can join immediately. Tell me what you're building." cta="Get in touch" />
    </article>
  );
}
