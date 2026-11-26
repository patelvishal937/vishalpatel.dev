// Blog posts live in content/blog/<slug>.md as Markdown with a small
// front-matter block. To publish a post, add a file; the blog index, post
// page, sitemap and RSS feed pick it up on the next build.
//
// ---
// title: Post title (the H1 on the page)
// seoTitle: Shorter title for the browser tab and Google (optional, ~45 chars)
// description: One or two sentences for Google and link previews
// date: 2026-11-26
// keywords: comma, separated, search phrases
// ---
//
// Supported Markdown: ## and ### headings, paragraphs, - lists, 1. lists,
// > quotes, ```code blocks```, `inline code`, **bold**, *italic* and
// [links](url). Kept deliberately small and dependency-free.

import fs from "node:fs";
import path from "node:path";

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string; // YYYY-MM-DD
  keywords: string[];
  html: string;
  readMins: number;
  headings: { id: string; text: string }[];
};

const DIR = path.join(process.cwd(), "content", "blog");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function inline(text: string) {
  // code spans first, so their contents are left alone
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((p) => {
      if (p.startsWith("`") && p.endsWith("`") && p.length > 1) return `<code>${esc(p.slice(1, -1))}</code>`;
      let s = esc(p);
      s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
        const external = /^https?:\/\//.test(href);
        return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
      });
      s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
      return s;
    })
    .join("");
}

function render(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  const headings: { id: string; text: string }[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      out.push(`<pre${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${esc(code.join("\n"))}</code></pre>`);
      continue;
    }
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      const text = h[2].trim();
      const id = slugify(text);
      if (h[1].length === 2) headings.push({ id, text });
      out.push(`<h${h[1].length} id="${id}">${inline(text)}</h${h[1].length}>`);
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\.\s+/ : /^[-*]\s+/).test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }
    if (line.startsWith(">")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) q.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote><p>${inline(q.join(" "))}</p></blockquote>`);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|[-*]\s|\d+\.\s|>)/.test(lines[i])) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return { html: out.join("\n"), headings };
}

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw.replace(/\r\n/g, "\n"));
  if (!m) throw new Error(`content/blog/${file}: missing front matter`);
  const meta: Record<string, string> = {};
  for (const l of m[1].split("\n")) {
    const kv = /^(\w+):\s*(.*)$/.exec(l);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }
  for (const k of ["title", "description", "date"]) if (!meta[k]) throw new Error(`content/blog/${file}: missing "${k}"`);
  const { html, headings } = render(m[2]);
  const words = m[2].split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title,
    seoTitle: meta.seoTitle || meta.title,
    description: meta.description,
    date: meta.date,
    keywords: (meta.keywords || "").split(",").map((s) => s.trim()).filter(Boolean),
    html,
    readMins: Math.max(1, Math.round(words / 220)),
    headings,
  };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

export const formatDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
