import { BrowserShot, ExtLink, Panel, Section, Stats } from "@/components/ui";
import { CreditBudget, McpArchitecture, TwoStepApproval } from "@/components/visuals/greta-mcp";

export default function GretaMcpBody() {
  return (
    <>
      <Section title="The problem">
        <p>Building on Greta meant working inside Greta&apos;s own web app. More and more developers live inside Claude, Cursor or ChatGPT, and they wanted to build without switching tabs.</p>
        <p>
          Handing a builder to an AI agent isn&apos;t simple. <strong>Builds take minutes, many actions cost credits, and some can&apos;t be undone</strong>, like publishing a page to a live site. The agent needed tools it could understand on its own, with guardrails that keep the person in control.
        </p>
      </Section>

      <Panel caption="From any MCP client to the Greta platform">
        <McpArchitecture />
      </Panel>

      <Section title="The idea">
        <p>
          A remote MCP server at <strong>mcp.greta.sh</strong>. Nothing to install: add it as a connector, sign in with Greta, and your assistant can build full-stack apps, self-growing websites and 3D websites, deploy them and keep them growing.
        </p>
        <p>Treat money and anything that goes live as the risky edges, and design those parts first.</p>
      </Section>

      <Panel caption="The public setup guide: one line for Claude Code, a URL for every other client">
        <div className="tallshot">
          <BrowserShot src="/shots/mcp-readme.webp" alt="Greta MCP server README on GitHub" url="github.com/Questera-Marketing/greta-mcp" href="https://github.com/Questera-Marketing/greta-mcp" w={1807} h={2156} />
        </div>
      </Panel>

      <Panel caption="Two-step approval for anything that goes live">
        <TwoStepApproval />
      </Panel>

      <Section title="What I built">
        <ul>
          <li><strong>Build by chat across three project kinds</strong>, with the agent stating what the person chose so it never guesses.</li>
          <li><strong>Long-running build tracking</strong>: a &ldquo;generating&rdquo; reply is a success, work continues on the server, and a free status tool reports progress.</li>
          <li><strong>Deploy, preview and publish</strong>, plus templates and themes.</li>
          <li><strong>Credit safety</strong>: balance, a per-call spending cap, spend reported on every paid call, and safe retries.</li>
          <li><strong>Growth toolset</strong> for self-growing sites, which took the server from 9 to 18 site actions in my first release.</li>
        </ul>
      </Section>

      <Panel caption="Every paid call can carry a cap">
        <CreditBudget />
      </Panel>

      <Section title="How I worked">
        <p>
          I used Claude from requirements to release: researching how developers use MCP servers, writing the plan, building and reviewing the code. Then I used Claude itself as the test client, building real apps and sites through the server and sorting every bug into <strong>&ldquo;MCP&rdquo; or &ldquo;platform&rdquo;</strong> so each fix landed in the right layer.
        </p>
        <p>For an AI agent, the tool description is the product. I rewrote names and descriptions until agents picked the right tool on their own.</p>
      </Section>

      <Section title="Impact">
        <p>Greta&apos;s MCP server went live for every production user in mid October 2026, with a public setup guide and listings on MCP directories.</p>
      </Section>
      <Stats
        items={[
          { value: "98/100", label: "Smithery quality score, up from 56", up: true },
          { value: "9 → 18", label: "Site actions in my growth release", up: true },
          { value: "12", label: "Sites built end to end before launch" },
        ]}
      />
      <p className="links">
        Links: <ExtLink href="https://github.com/Questera-Marketing/greta-mcp">Setup guide on GitHub</ExtLink> · <ExtLink href="https://glama.ai/mcp/connectors/sh.greta/greta">Glama listing</ExtLink> · <ExtLink href="https://www.greta.sh">greta.sh</ExtLink>
      </p>
    </>
  );
}
