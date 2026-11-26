// Shared Open Graph image (the preview card on LinkedIn, X, WhatsApp, Slack).
// Black like the site, with the red accent glow and the serif-style title.
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

export function ogImage({ kicker, title, foot }: { kicker: string; title: string; foot?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 88% 12%, rgba(227,18,75,0.55) 0%, rgba(227,18,75,0.12) 30%, #000 62%)",
          color: "rgba(255,255,255,0.96)",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontFamily: "sans-serif", fontSize: 26, letterSpacing: 2, color: "rgba(255,255,255,0.56)" }}>
          {kicker.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 64 : 80, lineHeight: 1.08, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "sans-serif", fontSize: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: "#fff",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "serif",
                fontSize: 30,
              }}
            >
              {site.initials.charAt(0)}
            </div>
            <div style={{ display: "flex" }}>{`${site.name} · ${site.role}`}</div>
          </div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.4)" }}>{foot ?? site.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
