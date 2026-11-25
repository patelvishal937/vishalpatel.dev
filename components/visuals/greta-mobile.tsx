import { Phone } from "@/components/ui";

const violet = "#a78bfa";

export function GretaHomeScreen() {
  return (
    <Phone>
      <div style={{ textAlign: "center", marginTop: 34 }}>
        <div style={{ font: "400 26px var(--serif)", color: "#fff" }}>G</div>
        <div style={{ color: "#bbb", marginTop: 30, fontSize: 10, background: "#ffffff10", display: "inline-block", padding: "3px 8px", borderRadius: 9 }}>
          Idea to product instantly
        </div>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginTop: 12 }}>Hi there!</div>
        <div style={{ color: "#fff", fontSize: 14 }}>What do you want to build?</div>
        <div style={{ color: "#888", fontSize: 10, margin: "6px 10px 0" }}>Describe an app or website and Greta builds it.</div>
      </div>
      <div style={{ marginTop: 34, border: "1px solid #333", borderRadius: 14, padding: 10, minHeight: 70, color: "#777", background: "#141418" }}>
        A booking app for my yoga studio with a class calendar<span style={{ color: violet }}>|</span>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
          <span className="chip" style={{ fontSize: 9 }}>Model ▾</span>
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", color: "#000" }}>↑</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 40, color: "#666", fontSize: 9 }}>
        <span style={{ color: "#fff" }}>Home</span>
        <span>Challenges</span>
        <span>Projects</span>
        <span>Settings</span>
      </div>
    </Phone>
  );
}

const files = ["src/pages/Calendar.tsx", "src/components/ClassCard.tsx", "src/lib/payments.ts", "server/routes/bookings.ts", "db/schema.sql"];

export function GretaChatScreen() {
  return (
    <Phone>
      <div style={{ color: "#ddd", fontWeight: 600, fontSize: 12, marginTop: 6 }}>‹ Yoga Booking App</div>
      <div style={{ margin: "12px 0 10px 30px", background: "#2a2340", borderRadius: "12px 12px 2px 12px", padding: "8px 10px", color: "#eee" }}>
        Add a class calendar and Stripe payments
      </div>
      <div style={{ color: "#aaa", marginBottom: 6 }}>Working on it. 5 actions taken:</div>
      {files.map((f, i) => (
        <div key={f} className="mono" style={{ display: "flex", gap: 6, alignItems: "center", background: "#16161b", border: "1px solid #26262c", borderRadius: 8, padding: "5px 7px", margin: "4px 0", fontSize: 9.5, color: "#bbb" }}>
          <span style={{ width: 7, height: 7, borderRadius: 2, background: i < 4 ? "#8b5cf6" : "#444", flex: "none" }} />
          {f}
        </div>
      ))}
      <div style={{ marginTop: 10, background: "#16161b", borderRadius: 10, padding: 8, color: "#ccc" }}>
        Preview is ready. <span style={{ color: violet }}>Open live URL ↗</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <span className="chip" style={{ fontSize: 9 }}>■ Stop</span>
        <span className="chip" style={{ fontSize: 9 }}>↺ Rollback</span>
        <span className="chip" style={{ fontSize: 9 }}>Deploy</span>
      </div>
    </Phone>
  );
}

export function GretaCreditsScreen() {
  return (
    <Phone>
      <div style={{ color: "#ddd", fontWeight: 600, fontSize: 12, marginTop: 6 }}>Credits</div>
      <div style={{ background: "linear-gradient(135deg,#2b1f55,#16161b)", borderRadius: 14, padding: 12, marginTop: 10 }}>
        <div style={{ color: "#aaa", fontSize: 10 }}>Balance</div>
        <div style={{ font: "600 24px var(--sans)", color: "#fff" }}>1,240</div>
        <div style={{ color: violet, fontSize: 10 }}>+50 from today&apos;s streak</div>
      </div>
      <div style={{ position: "relative", width: 150, height: 150, margin: "18px auto 8px" }}>
        <div
          className="spin"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid #1d1d22",
            background: "conic-gradient(#7c5cff 0 60deg,#2a2340 60deg 120deg,#a78bfa 120deg 180deg,#2a2340 180deg 240deg,#5b3fd6 240deg 300deg,#2a2340 300deg)",
          }}
        />
        <div style={{ position: "absolute", inset: 52, borderRadius: "50%", background: "#0b0b0f", display: "grid", placeItems: "center", color: "#fff", fontWeight: 600, fontSize: 11 }}>SPIN</div>
        <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", border: "7px solid transparent", borderTop: "12px solid #fff" }} />
      </div>
      <div style={{ textAlign: "center", color: "#aaa", fontSize: 10 }}>Daily spin for bonus credits</div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        {["Top up", "History"].map((t) => (
          <div key={t} style={{ flex: 1, background: "#16161b", borderRadius: 10, padding: 8, textAlign: "center", color: "#fff", fontWeight: 600 }}>{t}</div>
        ))}
      </div>
    </Phone>
  );
}

export function GretaMobileCover() {
  return (
    <div style={{ transform: "translateY(200px)" }}>
      <Phone cut>
        <div style={{ textAlign: "center", marginTop: 60, color: "#fff", fontSize: 15, fontWeight: 600 }}>What do you want to build?</div>
      </Phone>
    </div>
  );
}

const releases = [
  { v: "v1.0", when: "Mar", what: "MVP on both stores" },
  { v: "v1.0.2", what: "Model switch" },
  { v: "v1.0.4", what: "Streaks and challenges" },
  { v: "v1.0.7", what: "Knowledge base, credit history" },
  { v: "v1.0.10", what: "Top-ups and plans" },
  { v: "v2.0.1", what: "Spin the wheel" },
  { v: "v2.0.3", what: "Push notifications" },
  { v: "v2.0.4", when: "Aug", what: "#mention attachments" },
];

export function ReleaseTimeline() {
  return (
    <ol className="rtl">
      {releases.map((r) => (
        <li key={r.v}>
          <i aria-hidden="true" />
          <div className="mono v">
            {r.v}
            {r.when ? ` · ${r.when}` : ""}
          </div>
          <div className="w">{r.what}</div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- user story (research by the product designer, retold) ---------- */

const journey = [
  { t: "Gets the alert", n: "A teammate says the live link is broken" },
  { t: "Opens Greta", n: "Away from the laptop, phone in hand" },
  { t: "Finds the project", n: "Scrolls history across many live projects" },
  { t: "Opens it", n: "Screens built for desktop" },
  { t: "Waits", n: "Library and history load slowly" },
  { t: "Redeploys", n: "Has to watch the screen to know if it worked" },
  { t: "Build fails", n: "No reason, no next step" },
  { t: "Gives up", n: "Waits until back at the laptop", bad: true },
];

export function JourneyStrip() {
  return (
    <ol className="journey" aria-label="Ramos's urgent fix, before the redesign">
      {journey.map((s, i) => (
        <li key={s.t} className={s.bad ? "bad" : undefined}>
          <span className="jn">{i + 1}</span>
          <b>{s.t}</b>
          <small>{s.n}</small>
        </li>
      ))}
    </ol>
  );
}

const fixes = [
  { pain: "No direct path from the alert", fix: "Notifications that open the right project" },
  { pain: "Hard to find the right project", fix: "History with search and recent projects first" },
  { pain: "Slow, cramped desktop screens", fix: "Mobile-first screens in Flutter, one codebase" },
  { pain: "Unclear deploy progress", fix: "Live build steps in chat and deploy status" },
  { pain: "“Build failed” with no reason", fix: "A clear failure state with Retry" },
  { pain: "Mobile can’t finish the job", fix: "Chat, preview, deploy and share, all on the phone" },
];

export function PainFixTable() {
  return (
    <div className="painfix" role="table" aria-label="Pain points and what shipped">
      <div className="pf-h" role="row">
        <span role="columnheader">Pain point</span>
        <span role="columnheader">What shipped</span>
      </div>
      {fixes.map((f) => (
        <div className="pf-r" role="row" key={f.pain}>
          <span role="cell" className="p">{f.pain}</span>
          <span role="cell" className="f">{f.fix}</span>
        </div>
      ))}
    </div>
  );
}

const iterations = [
  { n: "1", t: "Top tabs", note: "The tabs took too much attention and space. Chat felt secondary." },
  { n: "2", t: "Floating toggle", note: "Less distracting, but hard to see on light and dark previews." },
  { n: "3", t: "Header toggle", note: "Beside the project title, always visible. This is what shipped.", final: true },
];

export function ToggleIterations() {
  return (
    <div className="iters">
      {iterations.map((it) => (
        <div key={it.n} className={it.final ? "iter final" : "iter"}>
          <span className="jn">{it.n}</span>
          <b>{it.t}</b>
          <small>{it.note}</small>
        </div>
      ))}
    </div>
  );
}
