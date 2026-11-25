import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} · ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "radial-gradient(circle at 85% 20%, #3b1fb0 0%, #0a0a0f 55%)",
          color: "#f4f4f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              background: "radial-gradient(circle at 30% 25%, #7c5cff, #1d1640 70%)",
            }}
          >
            {site.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{site.name}</div>
            <div style={{ fontSize: 26, color: "#9a9aa8" }}>{`${site.role} · ${site.location}`}</div>
          </div>
        </div>
        <div style={{ fontSize: 60, lineHeight: 1.1, fontWeight: 700, maxWidth: 1000 }}>{site.tagline}</div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#c4b5fd" }}>
          <span>Flutter</span>·<span>Full-stack</span>·<span>MCP servers</span>·<span>3D web</span>
        </div>
      </div>
    ),
    size,
  );
}
