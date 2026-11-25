import { Browser, Phone } from "@/components/ui";

const blue = "#60a5fa";

const feed = [
  { handle: "@fitwithria", title: "3 mistakes killing your squat", score: 92, trigger: "Curiosity gap" },
  { handle: "@homeworkouts.in", title: "10-min kettlebell routine", score: 81, trigger: "Time promise" },
  { handle: "@coach.arjun", title: "I tried this for 30 days", score: 74, trigger: "Transformation" },
  { handle: "@fitwithria", title: "What I eat in a day", score: 47, trigger: "Relatability" },
];

export function OutlierFeed() {
  return (
    <Browser url="clipmetry.com/dashboard" style={{ background: "#0c0e13", maxWidth: 520 }}>
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
          <b style={{ fontWeight: 600, color: "#fff" }}>Outlier feed</b>
          <span className="chip">5 competitors · daily refresh</span>
        </div>
        {feed.map((r) => (
          <div key={r.title} style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr) auto", gap: 12, alignItems: "center", background: "#15171d", border: "1px solid #23262e", borderRadius: 12, padding: 10, margin: "7px 0" }}>
            <div style={{ height: 48, borderRadius: 7, background: "linear-gradient(160deg,#3b82f6,#1e3a8a)" }} />
            <div>
              <div style={{ color: "#eee", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
              <div style={{ color: "#888", fontSize: 11.5 }}>{r.handle} · trigger: {r.trigger}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ font: "600 20px var(--sans)", color: r.score >= 70 ? "#4ade80" : "#facc15" }}>{r.score}</div>
              <div style={{ fontSize: 10, color: "#777" }}>{r.score >= 70 ? "viral" : "above avg"}</div>
            </div>
          </div>
        ))}
      </div>
    </Browser>
  );
}

export function ReelPhone() {
  return (
    <Phone>
      <div style={{ height: 330, borderRadius: 14, background: "linear-gradient(170deg,#60a5fa,#2563eb 60%,#1e3a8a)", padding: 14, position: "relative", color: "#fff" }}>
        <div style={{ textAlign: "center", fontSize: 10, opacity: 0.8 }}>Reels</div>
        <div style={{ marginTop: 40, fontSize: 13, fontWeight: 600 }}>
          <span style={{ background: "#fff", color: "#111", padding: "1px 4px", borderRadius: 3 }}>Stop scrolling</span> if your last reel died at 200 views
        </div>
        <div className="mono" style={{ position: "absolute", left: 10, top: 150, background: "#0b1020e6", border: "1px solid #ffffff30", borderRadius: 8, padding: "5px 8px", fontSize: 9.5 }}>
          <span style={{ opacity: 0.6 }}>TRIGGER</span>
          <br />
          <span style={{ color: "#93c5fd" }}>curiosity gap</span>
        </div>
        <div style={{ position: "absolute", right: 10, bottom: 60, textAlign: "center", fontSize: 9, lineHeight: 1.9 }}>
          ♥<br />89.2k<br />✉<br />1.4k
        </div>
        <div style={{ position: "absolute", left: 12, bottom: 16, fontSize: 10 }}>competitor_a · 3 hooks that stop the scroll</div>
      </div>
      <div style={{ marginTop: 10, background: "#15171d", borderRadius: 10, padding: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#bbb" }}>Outlier score</span>
        <b style={{ color: "#4ade80", fontSize: 16 }}>92</b>
      </div>
    </Phone>
  );
}

const bars = [40, 55, 48, 62, 35, 58, 200, 52, 45, 66, 120, 50];

export function BaselineChart() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }} role="img" aria-label="Bar chart: most posts sit near the account's 30-day median, two outliers rise far above it">
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 220, position: "relative", borderBottom: "1px solid #333", padding: "0 4px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, borderTop: `1.5px dashed ${blue}` }} />
        <div style={{ position: "absolute", right: 0, bottom: 66, fontSize: 12, color: blue }}>30-day trimmed median</div>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: h, borderRadius: "6px 6px 0 0", background: h > 110 ? "linear-gradient(#4ade80,#16a34a)" : "#2b3240" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#777", fontSize: 12, marginTop: 8 }}>
        <span>Older posts</span>
        <span style={{ color: "#4ade80" }}>Outliers score 70+</span>
        <span>Newest</span>
      </div>
    </div>
  );
}

export function BriefCard() {
  return (
    <div className="card" style={{ maxWidth: 340, background: "#0f1117" }}>
      <div className="k" style={{ color: blue, fontWeight: 500 }}>Brief · from @fitwithria&apos;s outlier</div>
      <h3>3 hooks</h3>
      <p>
        1. &ldquo;Your squat is wrong, and it&apos;s not your knees.&rdquo;
        <br />
        2. &ldquo;Three fixes I wish I knew in year one.&rdquo;
        <br />
        3. &ldquo;Watch my form before and after.&rdquo;
      </p>
      <h3 style={{ marginTop: 14 }}>Script skeleton</h3>
      <p>0-3s hook · 3-12s mistake one · 12-20s fix · 20-30s payoff and CTA</p>
      <h3 style={{ marginTop: 14 }}>Caption and hashtags</h3>
      <p>Save this for leg day. #squatform #homeworkout</p>
    </div>
  );
}

const planned = new Set([1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26]);

export function CalendarCard() {
  return (
    <div className="card" style={{ maxWidth: 340, background: "#0f1117" }}>
      <div className="k" style={{ color: blue, fontWeight: 500 }}>30-day calendar</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 5 }}>
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: planned.has(i) ? "#2563eb" : "#1a1d25", display: "grid", placeItems: "center", fontSize: 9, color: "#9ca3af" }}>
            {i + 1}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 12 }}>Each blue day is a planned Reel built from a proven outlier. Export to CSV or Notion.</p>
    </div>
  );
}

export function ClipmetryCover() {
  return (
    <div style={{ width: "86%", transform: "translateY(-6px)" }}>
      <Browser url="clipmetry.com">
        <div style={{ padding: 22, textAlign: "center", background: "#0c0e13" }}>
          <div style={{ font: "400 26px/1.1 var(--serif)", color: "#fff" }}>
            Know why clips go viral, <span style={{ color: blue }}>before you post</span>
          </div>
        </div>
      </Browser>
    </div>
  );
}
