import { Browser, Chip } from "@/components/ui";

const lilac = "#c4b5fd";

const calls = [
  { tool: "create_project", detail: "kind: self_growing · creditBudget: 20" },
  { tool: "get_generation_status", detail: "generating · 3 of 5 steps" },
  { tool: "get_generation_status", detail: "done · spent 11.4 credits" },
  { tool: "publish_site", detail: "live" },
];

function ToolCall({ tool, detail }: { tool: string; detail?: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#15151a", border: "1px solid #26262c", borderRadius: 10, padding: "8px 12px", margin: "6px 0" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flex: "none" }} />
      <span className="mono" style={{ color: lilac, fontSize: 12, flex: "none" }}>{tool}</span>
      {detail ? <span style={{ color: "#888", fontSize: 12, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>{detail}</span> : null}
    </div>
  );
}

/** An AI assistant building and publishing a Greta site through the MCP server. Illustrative example. */
export function AssistantChat() {
  return (
    <Browser url="AI assistant · connected to mcp.greta.sh" style={{ maxWidth: 600, background: "#0d0d10" }}>
      <div style={{ padding: 20, fontSize: 13.5, lineHeight: 1.55 }}>
        <div style={{ marginLeft: "auto", maxWidth: "78%", background: "#2a2a30", borderRadius: "16px 16px 4px 16px", padding: "10px 14px", color: "#eee" }}>
          Build a booking site for my yoga studio and put it live. Keep it under 20 credits.
        </div>
        <div style={{ margin: "14px 0 6px", color: "#aaa" }}>I&apos;ll create it on Greta.</div>
        {calls.map((c, i) => (
          <ToolCall key={i} {...c} />
        ))}
        <div style={{ marginTop: 12, color: "#ddd" }}>
          Your site is live at <span style={{ color: "#a78bfa" }}>shanti-flow.greta.sh</span>. It cost 11.4 of your 20-credit cap.
        </div>
      </div>
    </Browser>
  );
}

export function McpCover() {
  return (
    <div style={{ width: "86%", transform: "translateY(30px)" }}>
      <Browser url="mcp.greta.sh">
        <div style={{ padding: 18, background: "#0d0d10" }}>
          {["create_project", "get_generation_status", "publish_site"].map((t) => (
            <ToolCall key={t} tool={t} />
          ))}
        </div>
      </Browser>
    </div>
  );
}

export function McpArchitecture() {
  const clients = [
    { t: "Claude", n: "Claude Code, Claude.ai" },
    { t: "ChatGPT" },
    { t: "Cursor" },
    { t: "VS Code", n: "any MCP client" },
  ];
  const platform = [
    { t: "Builder", n: "full-stack, self-growing, 3D" },
    { t: "Hosting", n: "preview, deploy, publish" },
    { t: "Growth engine", n: "plans, drafts, publish gate" },
    { t: "Credits", n: "balance and billing" },
  ];
  return (
    <div className="stack-v">
      <div className="grid4">
        {clients.map((c) => (
          <div className="node" key={c.t} style={{ textAlign: "center" }}>
            <b>{c.t}</b>
            {c.n ? <small>{c.n}</small> : null}
          </div>
        ))}
      </div>
      <div className="down">↓ MCP over Streamable HTTP</div>
      <div className="node hi" style={{ textAlign: "center" }}>
        <b>mcp.greta.sh</b>
        <small>OAuth 2.1 sign-in with the user&apos;s Greta account</small>
      </div>
      <div className="down">↓</div>
      <div className="node">
        <b>Tool layer · 45+ tools</b>
        <small>credit caps · spend reporting · two-step approvals · safe retries with requestId</small>
        <div style={{ marginTop: 10 }}>
          {["Build", "Templates", "Themes", "Deploy & publish", "Growth", "Credits & monitoring"].map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>
      <div className="down">↓</div>
      <div className="grid4">
        {platform.map((c) => (
          <div className="node" key={c.t}>
            <b>{c.t}</b>
            <small>{c.n}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TwoStepApproval() {
  return (
    <div className="grid3">
      <div className="card">
        <div className="k mono" style={{ color: lilac }}>review_growth_item</div>
        <h3>1 · Preview only</h3>
        <p>
          Nothing changes. The server returns what would happen and a <span className="mono" style={{ color: "#eee" }}>confirmToken</span>.
        </p>
      </div>
      <div className="card">
        <div className="k" style={{ color: "#facc15" }}>The person decides</div>
        <h3>2 · Ask the human</h3>
        <p>The agent shows the change and waits for the person&apos;s own words of approval.</p>
      </div>
      <div className="card" style={{ borderColor: "#166534" }}>
        <div className="k mono" style={{ color: "#4ade80" }}>confirmToken + personSaid</div>
        <h3>3 · Apply</h3>
        <p>Only this second call publishes, approves or turns Growth on.</p>
      </div>
    </div>
  );
}

export function CreditBudget() {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: 13 }}>
        <span>creditBudget: 20</span>
        <span>spent 11.4</span>
      </div>
      <div style={{ height: 14, borderRadius: 9, background: "#26262c", margin: "8px 0", overflow: "hidden" }} role="meter" aria-valuemin={0} aria-valuemax={20} aria-valuenow={11.4} aria-label="Credits spent against the cap">
        <div style={{ width: "57%", height: "100%", background: "linear-gradient(90deg,#7c5cff,#a78bfa)" }} />
      </div>
      <div style={{ color: "#777", fontSize: 13 }}>
        If the estimate is over the cap, nothing runs and nothing is charged. Retrying with the same requestId never charges twice.
      </div>
    </div>
  );
}
