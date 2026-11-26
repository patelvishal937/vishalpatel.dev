"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import SectionLink from "./SectionLink";
import { isHomePath, sectionPath, SECTIONS, syncTitle, type Section } from "./sectionRoutes";

const labels: Record<Section, string> = { work: "Work", about: "About me", contact: "Contact" };

// Floating pill nav. Hidden over the hero, slides in once you scroll past it,
// highlights the section you're reading and keeps the address bar on its
// clean path (/work, /about, /contact, or / at the top).
export default function TopNav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState<Section | undefined>(undefined);

  useEffect(() => {
    let first = true;
    let last: Section | undefined | null = null;
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.6);
      let current: Section | undefined;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
      }
      setActive(current);
      // sync the URL as you scroll, without adding history entries
      if (!first && current !== last && isHomePath(window.location.pathname)) {
        const path = sectionPath(current);
        if (window.location.pathname !== path) {
          window.history.replaceState(null, "", path);
          syncTitle(current);
        }
      }
      last = current;
      first = false;
    };
    // let a section route scroll into place before we start syncing
    const t = window.setTimeout(onScroll, 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav className={show ? "topnav show" : "topnav"} aria-label="Main">
      <SectionLink className="logo" aria-label="Back to top">
        {site.initials[0]}
      </SectionLink>
      <span className="sep" aria-hidden="true" />
      {SECTIONS.map((id) => (
        <SectionLink key={id} to={id} className={active === id ? "l on" : "l"} aria-current={active === id ? "true" : undefined}>
          {labels[id]}
        </SectionLink>
      ))}
      <Link className="l" href="/blog">
        Blog
      </Link>
      <a className="l" href={site.resume} target="_blank" rel="noopener noreferrer">
        Resume ↗
      </a>
    </nav>
  );
}
