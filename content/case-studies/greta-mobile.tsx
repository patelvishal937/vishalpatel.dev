import { ExtLink, Flow, Panel, PhoneShot, Section, Stats, StoreBadges } from "@/components/ui";
import { JourneyStrip, PainFixTable, ReleaseTimeline, ToggleIterations } from "@/components/visuals/greta-mobile";

export default function GretaMobileBody() {
  return (
    <>
      <Section title="The problem">
        <p>
          Greta turns a prompt into a working app or website. But it was built for the desktop, and ideas don&apos;t wait for a laptop. On mobile web, <strong>43% of users dropped off</strong> before finishing a key project action, and mobile NPS sat at <strong>&minus;18</strong>.
        </p>
      </Section>

      <Section title="Who I built it for">
        <p>
          Before writing code, I wanted one real person to build for. Meet Ramos. He ships apps on Greta for his team and clients, with several projects live at once. Requests reach him on Slack, usually when he&apos;s away from his desk.
        </p>
        <p>His goal is simple: <strong>get a working, updated link out from wherever he is.</strong> This is what an urgent fix looked like for him on mobile web, and it became my checklist for the app.</p>
      </Section>

      <Panel caption="An urgent fix on mobile web, before the app. He can see the problem on his phone, but can't fix it there.">
        <JourneyStrip />
      </Panel>

      <Section title="The idea">
        <p>
          Don&apos;t shrink the desktop builder onto a small screen. Build for what people actually do away from their desk: capture an idea, find the right project fast, make a small change through chat, follow the build, preview, and share the live link.
        </p>
        <p>
          So I built in the order Ramos needs things: <strong>fast project access first</strong>, then AI chat, preview, deploy and share, notifications and project history. One Flutter codebase for iOS and Android, talking to the same Greta backend as the web, so a project started on the phone opens in the web editor and the other way round.
        </p>
      </Section>

      <Panel caption="The core loop: sign in, describe it, follow the build in chat, check your credits. Real screens from v2.0.4.">
        <div className="shots">
          <PhoneShot src="/shots/greta-login.webp" alt="Greta sign-in with email OTP, Apple or Google" />
          <PhoneShot src="/shots/greta-home.webp" alt="Greta home: what do you want to build?" />
          <PhoneShot src="/shots/greta-chat.webp" alt="A finished build in chat, with what it built and the credits it cost" />
          <PhoneShot src="/shots/greta-plan.webp" alt="Current plan with credits left" />
        </div>
      </Panel>

      <Panel caption="How the app connects to Greta">
        <Flow
          steps={[
            { title: "Flutter app", note: "iOS and Android, one codebase" },
            { title: "Greta account", note: "one login for every kind of customer" },
            { title: "AI generation", note: "builds and edits the project" },
            { title: "Hosting", note: "preview and one-tap deploy" },
            { title: "Credits", note: "store purchases and rewards" },
          ]}
        />
      </Panel>

      <Section title="What I built">
        <ul>
          <li><strong>Prompt-to-app chat</strong> with a model switch, stop-generation and rollback, and LLM tokens streamed over AWS Lambda for a live code preview.</li>
          <li><strong>Credits, plans and top-ups</strong> with StoreKit 2 and Google Play Billing subscriptions, live on both stores, plus a credit history page.</li>
          <li><strong>Engagement</strong>: daily streaks, challenges and a spin-the-wheel reward.</li>
          <li><strong>Workspace features</strong> shipped across releases: knowledge base, team collaboration, template marketplace, assets manager, #mention attachments and push notifications.</li>
          <li><strong>Monitoring</strong> with Sentry for errors and Google Analytics for usage.</li>
        </ul>
      </Section>

      <Panel caption="Each step where Ramos got stuck, and what I built so he doesn't">
        <PainFixTable />
      </Panel>

      <Section title="Getting chat and preview right">
        <p>On a small screen, chat and the live preview fight for space. The switch between them went through three versions before release, and I shipped the one that stayed out of the way.</p>
      </Section>
      <Panel caption="Three iterations of the chat and preview switch">
        <div className="split">
          <ToggleIterations />
          <PhoneShot src="/shots/greta-chat.webp" alt="The shipped header toggle beside the project title" />
        </div>
      </Panel>

      <Panel caption="Reasons to come back daily: spin the wheel, daily challenges, streaks and a full credit history">
        <div className="shots">
          <PhoneShot src="/shots/greta-spin.webp" alt="Spin the wheel for bonus credits" />
          <PhoneShot src="/shots/greta-challenges.webp" alt="Daily streaks and daily challenges that award credits" />
          <PhoneShot src="/shots/greta-streak.webp" alt="Streak calendar" />
          <PhoneShot src="/shots/greta-credits.webp" alt="Credit usage and history: refills, expiry and AI usage" />
        </div>
      </Panel>

      <Panel caption="The workspace: template marketplace, template details, your library, and notifications that ask for your OK before growth changes go live">
        <div className="shots">
          <PhoneShot src="/shots/greta-marketplace.webp" alt="Template marketplace with categories" />
          <PhoneShot src="/shots/greta-template.webp" alt="Template detail page" />
          <PhoneShot src="/shots/greta-library.webp" alt="Template library" />
          <PhoneShot src="/shots/greta-notifications.webp" alt="Notifications: credits refilled, changes waiting for your OK" />
        </div>
      </Panel>

      <Section title="Hard parts">
        <p>
          <strong>One login, two kinds of customer.</strong> Some people joined through a lifetime deal, some subscribe on greta.sh, and some are both. I worked through all three cases so each person lands in the app with the right account and plan, and worked on the mobile login service that decides it.
        </p>
        <p>
          <strong>Expired sessions on old installs.</strong> Users hit a &ldquo;no token&rdquo; error. I traced it to older app versions holding expired tokens; the current build fixes it.
        </p>
        <p>
          <strong>Shipping fast without breaking things.</strong> Sixteen store releases in about six months, each through two store reviews. Small, focused releases kept that pace safe.
        </p>
      </Section>

      <Panel caption="Release timeline, 2026">
        <ReleaseTimeline />
      </Panel>

      <Section title="Impact">
        <p>Greta Mobile is live on iOS and Android, and people use it. Usage from Google Analytics for the last 30 days, downloads and ratings since launch, as of November 2026.</p>
      </Section>
      <Stats
        items={[
          { value: "2,500+", label: "Downloads across both stores", up: true },
          { value: "920", label: "Active users, up 18.4%", up: true },
          { value: "29k", label: "Events tracked, up 21.7%", up: true },
          { value: "710", label: "Key events, up 21.2%", up: true },
          { value: "4.8 ★", label: "Rating on Google Play" },
          { value: "16", label: "Store releases in 2026" },
        ]}
      />
      <StoreBadges
        appStore="https://apps.apple.com/app/id6756906622"
        googlePlay="https://play.google.com/store/apps/details?id=com.questera.greta"
      />
      <p className="links">
        Web product at <ExtLink href="https://greta.sh">greta.sh</ExtLink>
      </p>
    </>
  );
}
