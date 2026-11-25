"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { isHomePath, scrollToSection, sectionPath, syncTitle, type Section } from "./sectionRoutes";

// A link to a home section (/work, /about, /contact, or / for the top).
// On the home page it scrolls smoothly and updates the address bar with the
// clean path; anywhere else it navigates to that route.
export default function SectionLink({
  to,
  className,
  children,
  ...rest
}: {
  to?: Section;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-current"?: "true" | undefined;
}) {
  const href = sectionPath(to);
  return (
    <Link
      href={href}
      className={className}
      scroll={false}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (!isHomePath(window.location.pathname)) return; // normal navigation
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        scrollToSection(to, reduce ? "auto" : "smooth");
        if (window.location.pathname !== href) window.history.pushState(null, "", href);
        syncTitle(to);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
