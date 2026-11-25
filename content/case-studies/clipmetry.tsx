import { BrowserShot, ExtLink, Flow, Panel, Section, Stats } from "@/components/ui";
import { BaselineChart, BriefCard, CalendarCard } from "@/components/visuals/clipmetry";

export default function ClipmetryBody() {
  return (
    <>
      <Section title="The problem">
        <p>View counts lie. A Reel with 500k views on a 5M-follower account is average. A Reel with 50k views on a 20k-follower account is a breakout.</p>
        <p>Most analytics tools report on your own account, not on what&apos;s working for your competitors. So creators scroll competitor profiles by hand and guess what to post next.</p>
      </Section>

      <Panel caption="Every post is scored against its own account's baseline, so a small creator's breakout ranks next to a big account's">
        <BaselineChart />
      </Panel>

      <Section title="The idea">
        <p>
          Add your competitors&apos; handles. Clipmetry scores every Reel <strong>0 to 100</strong> against that account&apos;s trimmed 30-day median. Scores of 70+ are viral outliers. Then AI explains why they worked and turns them into a brief for your own account.
        </p>
      </Section>

      <Panel caption="The real outlier feed: every post ranked against its own account's baseline. Creator handles are blurred.">
        <BrowserShot src="/shots/clipmetry-outliers.webp" alt="Clipmetry outlier feed with scores, views and brief status" url="clipmetry.com/dashboard/outliers" w={1459} h={812} />
      </Panel>

      <Panel caption="AI briefs with hooks and a script skeleton · a 30-day calendar built from proven outliers">
        <div className="row">
          <BriefCard />
          <CalendarCard />
        </div>
      </Panel>

      <Section title="What I built">
        <ul>
          <li><strong>Outlier feed</strong> ranking posts across all tracked competitors.</li>
          <li><strong>Hook and trigger analysis</strong> with Gemini: the first three seconds transcribed, the format and the psychological trigger named.</li>
          <li><strong>Briefs and scripts</strong>: three hooks, a script skeleton, caption, hashtags and thumbnail notes.</li>
          <li><strong>30-day calendar</strong> exportable to CSV or Notion, plus <strong>viral alerts</strong> by email when a post passes 5x baseline.</li>
          <li><strong>Plans and billing</strong>: Free, Pro and Agency with Razorpay, INR in India and USD elsewhere.</li>
        </ul>
      </Section>

      <Panel caption="Pricing: Free, Pro and Agency, billed in INR or USD through Razorpay">
        <BrowserShot src="/shots/clipmetry-pricing.webp" alt="Clipmetry pricing page" url="clipmetry.com/pricing" href="https://www.clipmetry.com/pricing" />
      </Panel>

      <Panel caption="How data flows through Clipmetry">
        <Flow
          steps={[
            { title: "Scheduler", note: "refresh by plan: 7 days, daily or 12 hours" },
            { title: "Apify", note: "public Reel data, no Instagram login" },
            { title: "Supabase", note: "Postgres store and auth" },
            { title: "Scoring", note: "trimmed 30-day median baseline" },
            { title: "Gemini", note: "hook, format, trigger, brief" },
            { title: "App", note: "feed, briefs, calendar, alerts" },
          ]}
        />
      </Panel>

      <Section title="Decisions that mattered">
        <p><strong>Fair scores.</strong> Raw views favour big accounts, so every post is scored against its own account.</p>
        <p><strong>Scraping costs.</strong> When several users track the same account, it&apos;s scraped once and shared.</p>
        <p><strong>Trust at signup.</strong> Public data only, sign-in with Google or a magic link, no Instagram password ever.</p>
        <p><strong>Built for search from day one.</strong> 13 long-form guides, 6 comparison pages, 2 free no-signup tools and an llms.txt file for AI answer engines.</p>
      </Section>

      <Panel caption="Built for search: a free no-signup tool and a long-form guide, both live">
        <div className="grid2">
          <BrowserShot src="/shots/clipmetry-tool.webp" alt="Free Instagram engagement rate calculator" url="clipmetry.com/tools" href="https://www.clipmetry.com/tools/engagement-rate-calculator" />
          <BrowserShot src="/shots/clipmetry-guide.webp" alt="Guide: what is an outlier reel" url="clipmetry.com/guides" href="https://www.clipmetry.com/guides/what-is-an-outlier-reel" />
        </div>
      </Panel>

      <Section title="Impact">
        <p>The whole product, pricing and content site shipped solo in a week, and it&apos;s listed on G2, Capterra and GetApp.</p>
      </Section>
      <Stats
        items={[
          { value: "1 week", label: "From idea to live product" },
          { value: "13", label: "SEO and AEO guides at launch" },
          { value: "2", label: "Free tools with no signup" },
        ]}
      />
      <p className="links">
        Link: <ExtLink href="https://www.clipmetry.com">clipmetry.com</ExtLink>
      </p>
    </>
  );
}
