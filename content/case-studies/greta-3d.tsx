import { BrowserShot, ExtLink, Flow, Panel, Section, Stats } from "@/components/ui";
import { ApproveCard, AssetPaths, moreExamples } from "@/components/visuals/greta-3d";

export default function Greta3DBody() {
  return (
    <>
      <Section title="The problem">
        <p>Cinematic 3D sites win attention, but they&apos;re slow and expensive to build: WebGL skills, the right models, lighting, camera work and a lot of tuning.</p>
        <p>
          AI builders struggled too. When we first asked the agent for a 3D site, <strong>it wrote a renderer from scratch every time</strong>, and the results were basic and inconsistent. And most people don&apos;t have a 3D model of their product.
        </p>
      </Section>

      <Panel caption="Live sites, each generated from a single prompt. Real 3D models, rendered in the browser. Brands are fictional, made for demos.">
        <div className="grid2">
          <BrowserShot src="/shots/3d-nimbus.webp" alt="Nimbus: a glowing 3D laptop" url="nimbus.greta.sh" href="https://nimbus-86leu0c.greta.sh" />
          <BrowserShot src="/shots/3d-lumora.webp" alt="Lumora: an interactive 3D camera" url="lumora.greta.sh" href="https://lumora-2wajnbs.greta.sh" />
          <BrowserShot src="/shots/3d-corvel.webp" alt="Corvel: a 3D watch on a dark, premium page" url="corvel.greta.sh" href="https://corvel-1r7iafc.greta.sh" />
          <BrowserShot src="/shots/3d-fjord.webp" alt="Fjord One: 3D headphones with rim lighting" url="fjord-one.greta.sh" href="https://fjord-one-5nm58yq.greta.sh" />
        </div>
      </Panel>
      <p className="links">
        More examples:{" "}
        {moreExamples.map((e, i) => (
          <span key={e.href}>
            {i ? " · " : null}
            <ExtLink href={e.href}>{e.name}</ExtLink>
          </span>
        ))}
      </p>

      <Section title="The idea">
        <p>
          Don&apos;t ask the AI to write WebGL. Give it strong building blocks. Every 3D project starts with a <strong>prebuilt scene runtime</strong> and the Three.js packages already in place, so the AI mounts a ready scene, drops in a real .glb model, lights it and moves the camera with scroll and pointer.
        </p>
      </Section>

      <Panel caption="From prompt to a live 3D site">
        <Flow
          steps={[
            { title: "Prompt", note: "in the Greta app or from an AI client through MCP" },
            { title: "Planner", note: "reuse, adapt or compose a scene" },
            { title: "Approve", note: "paid 3D steps wait for the user" },
            { title: "Scene runtime", note: "prebuilt Three.js scene, .glb model, light, camera" },
            { title: "Live site", note: "published on Greta, Growth optional" },
          ]}
        />
      </Panel>

      <Section title="Solving the asset problem">
        <p>The right model makes or breaks a 3D site, so every brief gets a path to one.</p>
      </Section>
      <Panel>
        <AssetPaths />
      </Panel>

      <Section title="What I built">
        <ul>
          <li><strong>3D Website project type</strong> next to full-stack apps and self-growing sites, reachable from the composer, from MCP or from a clear first message.</li>
          <li><strong>Scene planner and worlds</strong>, from ocean and neon city to a watch with a moving mechanism.</li>
          <li><strong>Approve card for paid 3D steps</strong> with the price up front and a Try again button.</li>
          <li><strong>Quality pass</strong>: colour restored on grey models, neutral reflections, an eye-level camera with no jump on load.</li>
          <li><strong>A safe boundary</strong>: 3D lives in its own mode, so existing projects stayed untouched, and tests proved it.</li>
        </ul>
      </Section>

      <Panel caption="Users see the price before any credits are spent">
        <ApproveCard />
      </Panel>

      <Section title="How I worked">
        <p>
          Claude was my pair through the whole feature. I researched the best 3D sites on the web with it, wrote the build plan as numbered phases, and built phase by phase. I wrote a Claude skill that pairs 3D scene creation with Greta MCP so marketing could make 3D sites from Claude, then tested at volume, generating site after site to find patterns one demo never shows.
        </p>
      </Section>

      <Section title="Impact">
        <p>3D websites went from an idea to their own Greta project type, and a generated object now costs half what it did.</p>
      </Section>
      <Stats
        items={[
          { value: "~2 wks", label: "From first build to own project type" },
          { value: "~180", label: "3D sites generated while tuning quality" },
          { value: "18 → 9", label: "Credits per generated object" },
        ]}
      />
    </>
  );
}
