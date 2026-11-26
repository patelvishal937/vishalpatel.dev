import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";
import { site } from "@/content/site";

// Search-facing copy: name + title + the skills recruiters filter on.
const seoTitle = `${site.name} · ${site.role} | Flutter, Full-Stack & MCP Developer in Ahmedabad, India`;
const seoDescription =
  "Vishal Patel is an AI-First Engineer in Ahmedabad, India: Flutter apps on iOS and Android, full-stack Next.js and Node.js, and MCP servers that let Claude, ChatGPT and Cursor build real software. Open to remote AI, full-stack and mobile roles.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seoTitle, template: `%s · ${site.name}` },
  description: seoDescription,
  applicationName: `${site.name} portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Vishal Patel",
    "AI-First Engineer",
    "AI engineer",
    "Flutter developer",
    "Flutter developer Ahmedabad",
    "full-stack developer India",
    "MCP server developer",
    "Model Context Protocol",
    "Claude Code",
    "Next.js developer",
    "remote developer India",
    "hire Flutter developer",
  ],
  openGraph: { title: seoTitle, description: seoDescription, type: "website", siteName: `${site.name} portfolio`, url: site.url, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription },
  alternates: { types: { "application/rss+xml": `${site.url}/blog/rss.xml` } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { themeColor: "#000000" };

// Structured data: who this site is about, so Google can show a proper
// result for name searches and connect the GitHub and LinkedIn profiles.
const personLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      url: site.url,
      jobTitle: site.role,
      description: seoDescription,
      email: `mailto:${site.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
      worksFor: { "@type": "Organization", name: "Quest Labs (Questera)" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "L.D. College of Engineering" },
      knowsAbout: ["Flutter", "Dart", "Next.js", "TypeScript", "Node.js", "Model Context Protocol (MCP)", "Claude Code", "AI agents", "Three.js", "Supabase", "PostgreSQL"],
      sameAs: [site.github, site.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: `${site.name} portfolio`,
      publisher: { "@id": `${site.url}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />
        <main>{children}</main>
      </body>
    </html>
  );
}
