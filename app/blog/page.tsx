import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPosts } from "@/lib/blog";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Blog: building with AI, MCP and Flutter",
  description:
    "Notes from shipping real products: production MCP servers, Claude Code workflows and Flutter apps on the App Store and Google Play. By Vishal Patel.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <div className="blog">
      <div className="cs-bar wrap">
        <div className="in">
          <Link className="back" href="/" aria-label="Back to home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5m6-6-6 6 6 6" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="wrap">
        <header className="cs-head">
          <h1>Notes from shipping</h1>
          <p>What I learned building AI products, MCP servers and Flutter apps. By {site.name}.</p>
        </header>
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="post-row">
                <span className="post-meta">
                  <time dateTime={p.date}>{formatDate(p.date)}</time> · {p.readMins} min read
                </span>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
