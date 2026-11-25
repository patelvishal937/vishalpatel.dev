"use client";

import { useEffect, useLayoutEffect } from "react";
import { scrollToSection, sectionFromPath, syncTitle, type Section } from "./sectionRoutes";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Opens /work, /about and /contact at their section, and keeps back/forward
// between section paths working.
export default function ScrollToSection({ section }: { section?: Section }) {
  useIsoLayoutEffect(() => {
    if (section) scrollToSection(section, "auto");
  }, [section]);

  useEffect(() => {
    const onPop = () => {
      const s = sectionFromPath(window.location.pathname);
      scrollToSection(s, "auto");
      syncTitle(s);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return null;
}
