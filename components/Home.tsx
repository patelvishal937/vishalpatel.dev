import Link from "next/link";
import ScrollToSection from "@/components/ScrollToSection";
import SectionLink from "@/components/SectionLink";
import type { Section } from "@/components/sectionRoutes";
import TopNav from "@/components/TopNav";
import HeroSceneLoader from "@/components/HeroSceneLoader";
import { caseStudies } from "@/content/case-studies";
import { alsoBuilt, site } from "@/content/site";
import { formatDate, getPosts } from "@/lib/blog";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

const timeline = [
  { d: "Oct 2023 - May 2024", t: "Flutter Developer", c: "Prepseed" },
  { d: "May 2024 - Now", t: "AI-First Engineer", c: "Quest Labs (Questera)" },
];

// The whole one-page site. "/", "/work", "/about" and "/contact" all render it;
// the section routes open it scrolled to that section.
export default function Home({ section }: { section?: Section }) {
  return (
    <>
      <ScrollToSection section={section} />
      <TopNav />

      {/* ---------- hero ---------- */}
      <section className="hero-h" id="top">
        <div className="bloom" />
        <div className="lines" />
        <div className="orb" aria-hidden="true" />
        <HeroSceneLoader />
        {/* text column: left on desktop (sphere on the right), centred and stacked below that */}
        <div className="hero-copy">
          <h1>
            Hi there,
            <br />I am {site.name.split(" ")[0]}
          </h1>
          <p>
            An {site.role} with {site.experience.replace("~", "")} of experience. Currently building Greta at Questera, an AI app builder, from its Flutter app to the MCP tools AI agents use.
          </p>
          <div className="hero-ctas">
            <SectionLink className="pill" to="contact">Get in touch</SectionLink>
            <a className="pill ghost" href={site.resume} target="_blank" rel="noopener noreferrer">
              Resume ↗
            </a>
          </div>
        </div>
      </section>

      {/* ---------- work ---------- */}
      <section className="home-sec wide" id="work">
        <h2 className="st">A few things I&apos;ve shipped</h2>
        <div className="cards">
          {caseStudies.map((c) => (
            <Link key={c.slug} href={`/work/${c.slug}`} className={c.featured ? "pcard feat" : "pcard"}>
              <div className="pc-txt">
                <p className="pc-tag">{c.tag}</p>
                <h3>{c.title}</h3>
                <p className="pc-desc">{c.summary}</p>
              </div>
              <div className="pc-vis" aria-hidden="true">{c.cover}</div>
              <span className="pc-arrow" aria-hidden="true"><Arrow /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- about ---------- */}
      <section className="home-sec wide" id="about">
        <h2 className="st">A bit about me</h2>
        <div className="bento">
          <div className="bx c8">
            <h3>Some context</h3>
            <p>
              I&apos;m an engineer from {site.location}. My core is Flutter and mobile, and over the last two years my work has moved toward AI: the systems that let AI assistants build websites, apps and 3D experiences on their own, safely.
            </p>
            <p>
              AI writes a lot of my code, but the engineering is still mine. I design the system, split the work into phases, and let Claude Code and Cursor build each one. Then I review every diff, test it on real devices, and write the parts that can&apos;t be wrong, like auth and payments, by hand.
            </p>
          </div>
          <div className="bx c4 photo" aria-hidden="true">
            <span>{site.initials}</span>
          </div>

          <div className="bx c4 edu">
            <h3>Education</h3>
            <div className="htl">
              <div>
                <p className="d">2024 · CGPA 8.2/10</p>
                <p className="t">B.E. Information Technology</p>
                <p className="small">L.D. College of Engineering</p>
              </div>
            </div>
          </div>
          <div className="bx c8">
            <div className="bx-head">
              <h3>Work experience</h3>
              <a href={site.resume} target="_blank" rel="noopener noreferrer">Resume ↗</a>
            </div>
            <div className="htl">
              {timeline.map((x) => (
                <div key={x.d}>
                  <p className="d">{x.d}</p>
                  <p className="t">{x.t}</p>
                  <p className="small">{x.c}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bx c6">
            <h3>What I work with</h3>
            <div className="chips">
              {site.workWith.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
          <div className="bx c6">
            <h3>Also at Questera</h3>
            <ul className="blist">
              {alsoBuilt.map((a) => (
                <li key={a.title}>
                  <b>{a.title}</b>
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- latest notes (links the blog from the home page) ---------- */}
      <section className="home-sec wide" aria-labelledby="notes-title">
        <h2 className="st" id="notes-title">Notes from shipping</h2>
        <ul className="post-list home-notes">
          {getPosts().slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="post-row">
                <span className="post-meta">
                  <time dateTime={p.date}>{formatDate(p.date)}</time> · {p.readMins} min read
                </span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="notes-all">
          <Link href="/blog">All notes →</Link>
        </p>
      </section>

      {/* ---------- say hello ---------- */}
      <section className="hello" id="contact">
        <div className="bloom" />
        <div className="lines" />
        <h2>Your turn. Say hello</h2>
        <p>Open to AI, full-stack and mobile roles, and I can join immediately. Have an opportunity, or just want to say hello?</p>
        <div className="row">
          <a className="circ" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
            </svg>
          </a>
          <a className="mail" href={`mailto:${site.email}`}>Email me</a>
          {site.linkedin ? (
            <a className="circ" href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V21H9z" />
              </svg>
            </a>
          ) : null}
          <a className="circ" href={site.resume} target="_blank" rel="noopener noreferrer" aria-label="Resume (PDF)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <path d="M14 3v6h6M12 12v6m-3-3 3 3 3-3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
