import type { ReactNode } from "react";
import { Browser } from "@/components/ui";

/* Simple drawn 3D-style product objects (SVG), so the case study has no screenshots. */
export function Cup() {
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="cupg" x1="0" x2="1">
          <stop offset="0" stopColor="#e9e4dc" />
          <stop offset=".55" stopColor="#fff" />
          <stop offset="1" stopColor="#cfc8bd" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="140" rx="80" ry="12" fill="#00000030" />
      <ellipse cx="100" cy="128" rx="70" ry="14" fill="#f3efe8" />
      <path d="M62 40h76l-6 78a14 14 0 0 1-14 12H82a14 14 0 0 1-14-12z" fill="url(#cupg)" />
      <ellipse cx="100" cy="40" rx="38" ry="8" fill="#6b4630" />
      <path d="M137 60c22 0 22 40 0 40" fill="none" stroke="#ece7df" strokeWidth="9" />
      <path d="M66 80h68" stroke="#d48a78" strokeWidth="5" />
    </svg>
  );
}

export function Laptop() {
  const bars = [20, 32, 24, 40, 48];
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="lapg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4d4dc" />
          <stop offset="1" stopColor="#8b8b96" />
        </linearGradient>
      </defs>
      <path d="M50 20h110l-12 84H38z" fill="#2a2a33" stroke="#c8c8d0" strokeWidth="3" />
      <path d="M56 28h96l-10 70H46z" fill="#0f0f17" />
      {bars.map((h, i) => (
        <rect key={i} x={66 + i * 15} y={80 - h} width="9" height={h} fill={i % 2 ? "#e5e5ea" : "#a78bfa"} />
      ))}
      <path d="M38 104h110l20 26H18z" fill="url(#lapg)" />
      <path d="M80 116h40l3 8H77z" fill="#6e6e78" />
    </svg>
  );
}

export function Camera() {
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="100" cy="146" rx="85" ry="10" fill="#00000025" />
      <rect x="30" y="46" width="140" height="86" rx="8" fill="#232327" />
      <rect x="80" y="30" width="44" height="20" fill="#2c2c31" />
      <rect x="128" y="38" width="22" height="10" rx="3" fill="#9a9aa2" />
      <circle cx="92" cy="92" r="34" fill="#1a1a1e" stroke="#3a3a40" strokeWidth="5" />
      <circle cx="92" cy="92" r="20" fill="#7d93a8" />
      <circle cx="86" cy="86" r="5" fill="#c9d6e2" />
      <circle cx="150" cy="70" r="5" fill="#f87171" />
    </svg>
  );
}

export function Watch() {
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
      <rect x="80" y="4" width="40" height="40" rx="6" fill="#8b5e4a" />
      <rect x="80" y="116" width="40" height="40" rx="6" fill="#6f4a3a" />
      <circle cx="100" cy="80" r="44" fill="#dfe3e8" />
      <circle cx="100" cy="80" r="37" fill="#7f9ec4" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="100" y1="47" x2="100" y2="53" stroke="#eef2f7" strokeWidth="2.5" transform={`rotate(${i * 30} 100 80)`} />
      ))}
      <line x1="100" y1="80" x2="100" y2="58" stroke="#fff" strokeWidth="3" />
      <line x1="100" y1="80" x2="120" y2="72" stroke="#fff" strokeWidth="2.5" />
      <rect x="143" y="75" width="8" height="10" rx="2" fill="#cfd4da" />
    </svg>
  );
}

export function Headphones() {
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
      <path d="M48 96a52 52 0 0 1 104 0" fill="none" stroke="#2a2a30" strokeWidth="12" strokeLinecap="round" />
      <path d="M58 80a42 42 0 0 1 84 0" fill="none" stroke="#bfc3c9" strokeWidth="3" />
      <rect x="30" y="86" width="36" height="52" rx="16" fill="#1f1f24" />
      <rect x="134" y="86" width="36" height="52" rx="16" fill="#1f1f24" />
      <ellipse cx="152" cy="112" rx="10" ry="18" fill="none" stroke="#e5e7eb" strokeWidth="3" />
    </svg>
  );
}

type SiteProps = { url: string; bg: string; ink: string; title: string; sub: string; object: ReactNode; button: string; light?: boolean };

export function Site3D({ url, bg, ink, title, sub, object, button, light }: SiteProps) {
  return (
    <Browser url={url}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", alignItems: "center", gap: 10, padding: "26px 22px", background: bg, minHeight: 210 }}>
        <div>
          <div style={{ font: "400 clamp(20px,2.4vw,28px)/1.05 var(--serif)", color: ink }}>{title}</div>
          <div style={{ fontSize: 11, color: ink, opacity: 0.65, margin: "8px 0 12px" }}>{sub}</div>
          <span style={{ fontSize: 10, padding: "6px 10px", borderRadius: 999, background: button, color: light ? "#111" : "#fff" }}>Explore</span>
        </div>
        <div className="float" style={{ height: 150 }}>{object}</div>
      </div>
    </Browser>
  );
}

export function Hero3D() {
  return (
    <a href="https://kiln-clay-2jhnfee.greta.sh" target="_blank" rel="noopener noreferrer" aria-label="Open the kiln-clay.greta.sh example site" style={{ display: "block", textDecoration: "none", width: "min(620px,100%)", alignSelf: "center", marginBottom: 40 }}>
      <Site3D url="kiln-clay.greta.sh" bg="#f4ead9" ink="#2b1d12" title="Objects for slow mornings" sub="Handmade ceramic drinkware" object={<Cup />} button="#b8893a" />
    </a>
  );
}

// Live examples generated with the feature. Brands are fictional, made for demos.
const gallery = [
  { href: "https://nimbus-86leu0c.greta.sh", url: "nimbus.greta.sh", bg: "#0b0717", ink: "#f5f3ff", title: "Light enough for every next step.", sub: "Thin laptop for students", object: <Laptop />, button: "#7c5cff" },
  { href: "https://lumora-2wajnbs.greta.sh", url: "lumora.greta.sh", bg: "#f0f0ec", ink: "#111", title: "See what you see.", sub: "Mirrorless travel camera", object: <Camera />, button: "#555" },
  { href: "https://corvel-1r7iafc.greta.sh", url: "corvel.greta.sh", bg: "#0c0d10", ink: "#f2efe8", title: "Time, reduced to its essentials.", sub: "Swiss automatic watches", object: <Watch />, button: "#5b6472" },
  { href: "https://fjord-one-5nm58yq.greta.sh", url: "fjord-one.greta.sh", bg: "#111312", ink: "#eef2ef", title: "Silence, beautifully tuned.", sub: "Over-ear headphones", object: <Headphones />, button: "#dfe6e2", light: true },
];

// Examples without a drawn card, listed as links under the gallery.
export const moreExamples = [
  { href: "https://skyhawk-tbyew84.greta.sh", name: "Skyhawk Drones" },
  { href: "https://fix-chocolatier-xo9eq4z.greta.sh", name: "FIX Chocolatier" },
  { href: "https://bloom-botanicals-ohbe93m.greta.sh", name: "Bloom Botanicals" },
];

export function ExampleGallery() {
  return (
    <div className="grid2">
      {gallery.map(({ href, ...s }) => (
        <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} aria-label={`Open the ${s.url} example site`}>
          <Site3D {...s} />
        </a>
      ))}
    </div>
  );
}

const paths = [
  { t: "User's own model", d: "The person uploads a .glb, Greta lights and frames it.", c: "#7c5cff" },
  { t: "Library object", d: "Reuse or adapt a tested model from the library.", c: "#0ea5e9" },
  { t: "Composed scene", d: "Build the scene from shapes and worlds like ocean or neon city.", c: "#14b8a6" },
  { t: "Generated object", d: "Create a custom model, after the user approves the price.", c: "#f59e0b" },
  { t: "Procedural fallback", d: "No model? A clean procedural shape keeps the page working.", c: "#64748b" },
  { t: "Growth on", d: "Any 3D site can switch on self-growing SEO and AEO pages.", c: "#22c55e" },
];

export function AssetPaths() {
  return (
    <div className="grid3">
      {paths.map((p) => (
        <div className="card" key={p.t}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${p.c}33`, border: `1px solid ${p.c}`, marginBottom: 12 }} />
          <h3>{p.t}</h3>
          <p>{p.d}</p>
        </div>
      ))}
    </div>
  );
}

export function ApproveCard() {
  return (
    <div className="card" style={{ maxWidth: 380, margin: "0 auto", background: "#101014" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: "#1d1d22", padding: 6, flex: "none" }}>
          <Watch />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>Generate a custom 3D watch?</h3>
          <p>Main object for your hero scene</p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 0", color: "#ddd", fontSize: 14 }}>
        <span>Cost</span>
        <b style={{ fontWeight: 600 }}>15 credits</b>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <span style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, background: "#fff", color: "#111", fontWeight: 600, fontSize: 14 }}>Approve</span>
        <span style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, border: "1px solid #333", color: "#ccc", fontSize: 14 }}>No, build it yourself</span>
      </div>
      <p style={{ marginTop: 12, fontSize: 12, textAlign: "center" }}>If a model fails, the user gets a Try again button.</p>
    </div>
  );
}

export function ThreeDCover() {
  return (
    <div className="float" style={{ width: "56%", height: 200 }}>
      <Watch />
    </div>
  );
}
