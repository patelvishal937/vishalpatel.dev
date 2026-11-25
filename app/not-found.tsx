import Link from "next/link";

export default function NotFound() {
  return (
    <div className="more" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="glowfield" />
      <div className="glow" />
      <h2>This page wandered off.</h2>
      <p>The link may be old. The work is all on the portfolio page.</p>
      <div>
        <Link className="btn" href="/">Back to portfolio</Link>
      </div>
    </div>
  );
}
