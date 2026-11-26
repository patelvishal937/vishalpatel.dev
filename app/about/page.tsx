import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "About",
  description: "About Vishal Patel: AI-First Engineer from Ahmedabad, experience, education and the stack I work with.",
  alternates: { canonical: "/" },
};

// Same one-page site, opened at the about section.
export default function AboutPage() {
  return <Home section="about" />;
}
