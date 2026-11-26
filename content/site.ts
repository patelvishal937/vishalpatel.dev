// Everything about Vishal that appears on the site lives here.
// Change it in one place and every page updates.

export const site = {
  name: "Vishal Patel",
  initials: "VP",
  role: "AI-First Engineer",
  location: "Ahmedabad, India",
  experience: "~3 years",
  availability: "Open to roles · can join immediately",
  companies: [
    { name: "Questera", tone: "dark" },
    { name: "Prepseed", tone: "blue" },
  ],
  github: "https://github.com/patelvishal937",
  githubHandle: "github.com/patelvishal937",
  email: "patelvishal93137@gmail.com",
  linkedin: "https://www.linkedin.com/in/patel-vishal-b46b2b240/",
  resume: "/resume.pdf", // built from resume/resume.html with `npm run resume`
  updated: "2026-11-26", // bump when the site content changes (sitemap lastmod)
  url: "https://vishalpatel-dev.vercel.app", // live site; change here if a custom domain is added
  tagline: "I build AI-powered products, from mobile apps to the tools AI agents use.",
  intro:
    "AI-First Engineer at Questera. I ship Flutter apps to the App Store and Play Store, build full-stack products, and design MCP servers and generation systems that let AI do real work. I work with Claude as my pair programmer, from requirements to release.",
  // Chips in the "What I work with" card on the home page.
  workWith: [
    "Flutter", "Dart", "SwiftUI", "Jetpack Compose", "Bloc / Riverpod",
    "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "Firebase",
    "Claude Code", "Cursor", "MCP servers", "Gemini", "Three.js", "AWS Lambda",
  ],
  stackChips: [
    "Flutter", "Dart", "React / Next.js", "Node.js", "TypeScript",
    "PostgreSQL", "Supabase", "MCP", "Three.js", "Gemini", "Claude",
  ],
} as const;

export const experience = [
  {
    title: "AI-First Engineer · Quest Labs (Questera)",
    when: "May 2024 to now · Remote (US startup)",
    text: "Greta AI mobile app (Flutter, iOS and Android), Greta MCP server, 3D website generation with a Higgsfield connector for AI visuals, landing page generation and the marketplace engine. Also published the Quest SDKs for Flutter, SwiftUI and Compose, and wore engineering, marketing and hiring hats.",
  },
  {
    title: "Flutter Developer · Prepseed (EdTech)",
    when: "Oct 2023 to May 2024 · Ahmedabad",
    text: "Shipped one codebase for four user roles, with offline-first sync and FCM deep-link notifications.",
  },
  {
    title: "B.E. Information Technology",
    when: "L.D. College of Engineering · 2024 · CGPA 8.2/10",
    text: "SSIP Gujarat state-level winner for a government workflow app.",
  },
];

// Smaller work that doesn't get its own case study.
export const alsoBuilt = [
  { title: "Landing Page Generation", text: "A product brief goes in, a deploy-ready, conversion-focused page comes out in one step." },
  { title: "Marketplace Engine", text: "Search, preview and clone Greta templates in the app or through MCP agents." },
  { title: "Quest SDKs", text: "Three AI gamification SDKs (Flutter on pub.dev, SwiftUI, Compose) with server-driven UI, so flow changes need zero releases." },
  { title: "Higgsfield connector", text: "AI visuals for generated sites, so one prompt can become a cinematic site." },
];

export const howIBuild =
  "AI writes a lot of my code, but the engineering is still mine. I design the system, split the work into phases, and let Claude Code and Cursor build each one. Then I review every diff, test it on real devices, and write the parts that can't be wrong, like auth and payments, by hand.";

export const stack = [
  { group: "Mobile", items: "Flutter, Dart, SwiftUI, Jetpack Compose, Bloc/Cubit, Provider, Riverpod, GetIt, GoRouter, clean architecture, StoreKit 2 and Play Billing, App Store and Play Store releases" },
  { group: "Web and backend", items: "React, Next.js, TypeScript, Tailwind, Node.js, Express, PostgreSQL, Supabase, Firebase, REST APIs" },
  { group: "AI", items: "Claude Code, Cursor, MCP servers, custom skills, agent orchestration, LLM APIs (Gemini, multi-model), token streaming, code-generation pipelines" },
  { group: "3D and motion", items: "Three.js and WebGL scenes with .glb models, scroll-driven camera motion" },
  { group: "Infra and tools", items: "AWS Lambda, Netlify, Razorpay, Apify, Sentry, Git, CI/CD, testing" },
];
