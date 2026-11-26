import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Vishal Patel: email, GitHub, LinkedIn and resume. Open to AI, full-stack and mobile roles.",
  alternates: { canonical: "/" },
};

// Same one-page site, opened at the contact section.
export default function ContactPage() {
  return <Home section="contact" />;
}
