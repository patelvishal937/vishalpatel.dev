import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Work",
  description: "Things I have shipped: the Greta AI Flutter app, Greta\'s MCP server, 3D website generation and Clipmetry.",
  alternates: { canonical: "/work" },
};

// Same one-page site, opened at the work section.
export default function WorkPage() {
  return <Home section="work" />;
}
