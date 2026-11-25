"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const items = [
  { id: "work", label: "Work" },
  { id: "about", label: "About me" },
  { id: "contact", label: "Contact" },
];

// Floating pill nav. Hidden over the hero, slides in once you scroll past it,
// and highlights the section you're reading.
export default function TopNav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("work");

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.6);
      let current = "work";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={show ? "topnav show" : "topnav"} aria-label="Main">
      <a className="logo" href="#top" aria-label="Back to top">
        {site.initials[0]}
      </a>
      <span className="sep" aria-hidden="true" />
      {items.map((it) => (
        <a key={it.id} className={active === it.id ? "l on" : "l"} href={`#${it.id}`} aria-current={active === it.id ? "true" : undefined}>
          {it.label}
        </a>
      ))}
      <a className="l" href={site.resume} target="_blank" rel="noopener noreferrer">
        Resume ↗
      </a>
    </nav>
  );
}
