// Path-based "sections" of the one-page home: /work, /about and /contact are
// real routes that render the home page scrolled to that section.

export const SECTIONS = ["work", "about", "contact"] as const;
export type Section = (typeof SECTIONS)[number];

export const sectionPath = (s?: Section) => (s ? `/${s}` : "/");

export function sectionFromPath(path: string): Section | undefined {
  const p = path.replace(/\/+$/, "").slice(1);
  return (SECTIONS as readonly string[]).includes(p) ? (p as Section) : undefined;
}

export const isHomePath = (path: string) => path === "/" || path === "" || sectionFromPath(path) !== undefined;

export function scrollToSection(s: Section | undefined, behavior: ScrollBehavior) {
  if (!s) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(s)?.scrollIntoView({ behavior, block: "start" });
}

const TITLES: Record<Section, string> = { work: "Work", about: "About", contact: "Contact" };

// keep the tab title in step with the path when we change it without a navigation
export function syncTitle(s: Section | undefined) {
  document.title = s ? `${TITLES[s]} · Vishal Patel` : "Vishal Patel · AI-First Engineer";
}
