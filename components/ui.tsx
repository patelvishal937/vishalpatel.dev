import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/* ---------- device frames ---------- */

export function Phone({ children, cut = false }: { children: ReactNode; cut?: boolean }) {
  return (
    <div className={cut ? "phone cut" : "phone"} aria-hidden="true">
      <div className="isl" />
      <div className="sb">
        <span>9:41</span>
        <span>●●● ▮</span>
      </div>
      <div className="scr">{children}</div>
    </div>
  );
}

export function Browser({ url, children, style }: { url: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="browser" style={style}>
      <div className="bbar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{url}</span>
      </div>
      {children}
    </div>
  );
}

/* ---------- real screenshots ---------- */

// A real app screen (captured from the iOS Simulator) inside a phone bezel.
export function PhoneShot({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="pshot">
      <Image src={src} alt={alt} width={1206} height={2622} sizes="(max-width: 640px) 60vw, 260px" priority={priority} />
    </div>
  );
}

// A real web page screenshot inside a browser frame. Optional link to the live page.
export function BrowserShot({ src, alt, url, href, w = 2880, h = 1800, priority }: {
  src: string;
  alt: string;
  url: string;
  href?: string;
  w?: number;
  h?: number;
  priority?: boolean;
}) {
  const frame = (
    <div className="browser">
      <div className="bbar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{url}</span>
      </div>
      <Image src={src} alt={alt} width={w} height={h} sizes="(max-width: 640px) 92vw, 840px" priority={priority} style={{ display: "block", width: "100%", height: "auto" }} />
    </div>
  );
  return href ? (
    <a className="shot-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${alt} (opens the live site)`}>
      {frame}
    </a>
  ) : (
    frame
  );
}

/* ---------- layout blocks ---------- */

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sec">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Panel({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="panel" style={{ marginInline: 0 }}>
      {children}
      {caption ? <figcaption className="cap">{caption}</figcaption> : null}
    </figure>
  );
}

export type FlowStep = { title: string; note?: string };

export function Flow({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="flow" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {steps.map((s) => (
        <li className="node" key={s.title}>
          <b>{s.title}</b>
          {s.note ? <small>{s.note}</small> : null}
        </li>
      ))}
    </ol>
  );
}

export type Stat = { value: string; label: string; up?: boolean };

export function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="impact">
      {items.map((s) => (
        <div className="stat" key={s.label}>
          <div className="n">
            {s.value}
            {s.up ? <i aria-label="increase">▲</i> : null}
          </div>
          <div className="l">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/* ---------- store badges (drawn, not images) ---------- */

export function StoreBadges({ appStore, googlePlay }: { appStore: string; googlePlay: string }) {
  return (
    <div className="badges">
      <a className="badge" href={appStore} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.8zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" />
        </svg>
        <span><small>Download on the</small>App Store</span>
      </a>
      <a className="badge" href={googlePlay} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
        <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
          <path d="M1 1l10.5 10L1 21c-.4-.2-.6-.6-.6-1.1V2.1c0-.5.2-.9.6-1.1z" fill="#34a853" />
          <path d="M15 7.6L11.5 11 1 1c.2-.1.5-.1.8 0z" fill="#4285f4" />
          <path d="M15 14.4L1.8 21c-.3.1-.6.1-.8 0l10.5-10z" fill="#ea4335" />
          <path d="M15 7.6l3.5 2c1 .6 1 1.8 0 2.4l-3.5 2-3.5-3.4z" fill="#fbbc04" />
        </svg>
        <span><small>Get it on</small>Google Play</span>
      </a>
    </div>
  );
}

/* ---------- end-of-page call to action ---------- */

export function MoreCta({ title = "Want to know more?", text, cta = "Get in touch", href = "/#contact" }: {
  title?: string;
  text?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <div className="more">
      <div className="glowfield" />
      <div className="glow" />
      <h2>{title}</h2>
      <p>
        {text ??
          "The full story has more detail than fits here: the tradeoffs, the dead ends and what didn't ship. Get in touch for a walkthrough."}
      </p>
      {href.startsWith("http") ? (
        <a className="btn" href={href} target="_blank" rel="noopener noreferrer">
          {cta}
        </a>
      ) : (
        <Link className="btn" href={href}>
          {cta}
        </Link>
      )}
    </div>
  );
}
