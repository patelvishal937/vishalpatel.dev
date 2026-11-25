# vishalpatel.dev

Portfolio of **Vishal Patel**, AI-First Engineer. I ship Flutter apps, full-stack products and MCP servers that let AI agents build real software.

Built with Next.js (App Router) and TypeScript. Every page is prerendered as static HTML.

## Case studies

- **Greta AI, in your pocket**: the Flutter app on the App Store and Google Play (2,500+ downloads, 4.8★ on Google Play)
- **Know why clips go viral**: Clipmetry, my own AI SaaS for Instagram Reels, shipped solo in 7 days
- **Building apps from any AI assistant**: Greta's remote MCP server (45+ tools, Smithery score 98/100)
- **One prompt, a real 3D website**: 3D website generation in Greta with Three.js

Screens are real: the Greta app was captured from the iOS Simulator, and the web products from their live pages.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

- Personal details, links, intro, experience and stack: `content/site.ts`
- Case study list, titles and the role / team / timeline row: `content/case-studies/index.tsx`
- Case study text: `content/case-studies/<slug>.tsx`
- Diagrams: `components/visuals/<slug>.tsx`
- Screenshots: `public/shots/` (WebP)
- Resume: edit `resume/resume.html`, then run `npm run resume` to rebuild `public/resume.pdf`

## Deploy

Import the repo in Vercel. No settings needed.
