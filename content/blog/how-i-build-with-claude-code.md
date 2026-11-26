---
title: "My Claude Code workflow: custom skills, phase-gated builds and reviewing every diff"
seoTitle: My Claude Code workflow for production code
description: How I ship production code with Claude Code and Cursor: custom skills that force phase-gated builds, a plan, build, review loop, and what I always write myself.
date: 2026-11-26
keywords: Claude Code workflow, Claude Code skills, custom Claude skills, AI-assisted development, AI pair programming, vibe coding in production, AI-first engineer, ship SaaS with Claude Code
---

AI writes a lot of my code. The engineering is still mine. This post is my Claude Code workflow: how I plan, split, build and review so that fast AI output is still code I can stand behind.

I direct **Claude Code** and **Cursor** agents through most of my code. With this workflow I shipped [Clipmetry](/work/clipmetry), a full AI SaaS, **solo in 7 days**, and I built [Greta's MCP server](/work/greta-mcp) and its [3D website generation](/work/greta-3d) with Claude as my pair.

## The loop

Every feature goes through the same loop:

1. **Plan.** I write the plan with Claude: what we are building, what done looks like, what can go wrong.
2. **Split.** I break it into small phases that can each be built and checked on their own.
3. **Agents build.** Claude Code builds one phase at a time.
4. **I review every diff.** Nothing merges that I have not read.
5. **Test.** On real devices for mobile, through real clients for AI tools.
6. **Hand-write the sensitive parts.** Auth and payments I write and check myself.

None of these steps is new. What is new is that step 3 is fast, so steps 1, 4 and 5 are where my time goes now.

## Custom Claude Code skills that force phases

Left alone, an agent will happily build the UI, the database and the business logic in one giant change. That is impossible to review properly.

So I wrote **custom Claude Code skills** that force a phase-gated build: **data first, then domain logic, then UI**. Each phase has to work and be reviewed before the next one starts. The skill does not let the agent skip ahead.

Here is the idea, simplified:

```markdown
---
name: phased-build
description: Use for any new feature. Builds it in gated phases.
---
Build in three phases, in this order:
1. Data: models, storage, API calls. Stop. Show the diff.
2. Domain: business rules on top of the data. Stop. Show the diff.
3. UI: screens that use the domain layer. Stop. Show the diff.
Do not start a phase until I approve the one before it.
```

This one change did more for code quality than any prompt trick. Small phases mean small diffs, and small diffs are diffs I actually read.

## Keep the decisions in the repo

An agent starts every session with no memory of the last one. So the decisions live in the project, in a `CLAUDE.md` file: who the product is for, what was decided and why, what not to bring back, and the commands to build and test. This portfolio was built that way. When a session ends, the next one picks up from the file, not from my memory.

## Numbered phases for bigger features

For the [3D website generation](/work/greta-3d) feature in Greta, I first researched the best 3D sites on the web with Claude. Then I wrote the build plan as **numbered phases** and built the feature one phase at a time.

It went from first build to its own project type in Greta in about **two weeks**. Along the way I generated and reviewed around **180 3D sites** to tune quality. Testing at volume showed patterns that one demo never would.

## Use the AI as the test client too

For the MCP server, Claude was also the **test client**: it built real sites through the server before launch, and I sorted every bug into "MCP" or "platform". The details are in [What I learned shipping a production remote MCP server](/blog/shipping-a-production-remote-mcp-server).

## What I never hand to the agent

- **Auth and payments.** I write these myself and test them by hand. With Clipmetry that meant Razorpay subscriptions in INR and USD. With the Greta app it meant StoreKit 2 and Google Play Billing.
- **The final decision on a diff.** The agent proposes. I approve.
- **What counts as done.** The plan sets it, and I check it.

## Is this vibe coding?

I call myself a vibe coder, and I mean it as a compliment. But vibe coding only works in production if the vibes come with a plan, small phases and a human who reads every diff. Speed without review is just a faster way to ship bugs.

## FAQ

### What are Claude Code skills?

Skills are reusable instructions that Claude Code loads when a task matches them. I use them to encode how I want work done, such as building in phases, so I do not repeat the same rules in every prompt.

### Can you ship production code with an AI coding agent?

Yes, if a person still owns the plan, reviews every diff and writes the risky parts. The agent makes building fast. It does not make reviewing optional.

If you are hiring an engineer who can move fast with AI agents and still own what ships, [let's talk](/contact). My [resume](/resume.pdf) has the details.
