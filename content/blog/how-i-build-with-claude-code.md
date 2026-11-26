---
title: "How I build with Claude Code: phase-gated skills and reviewing every diff"
description: My AI-first engineering workflow with Claude Code and Cursor. Custom skills that force phase-gated builds, a plan-split-build-review loop, and the parts I always write by hand. It is how I shipped a SaaS solo in 7 days.
date: 2026-11-26
keywords: Claude Code workflow, AI-assisted development, Claude Code skills, AI pair programming, vibe coding, AI-first engineer, Cursor AI workflow, ship SaaS fast with AI
---

AI writes a lot of my code. The engineering is still mine. That sentence sums up how I work, and this post is the longer version.

I direct **Claude Code** and **Cursor** agents through most of my code. With this workflow I shipped [Clipmetry](/work/clipmetry), a full AI SaaS, **solo in 7 days**, and I built [Greta's MCP server](/work/greta-mcp) and its [3D website generation](/work/greta-3d) with Claude as my pair.

## The loop

Every feature goes through the same loop:

1. **Plan.** I write the plan with Claude: what we are building, what done looks like, what can go wrong.
2. **Split.** I break it into small phases that can each be built and checked on their own.
3. **Agents build.** Claude Code builds one phase at a time.
4. **I review every diff.** Nothing merges that I have not read.
5. **Test.** On real devices for mobile, through real clients for AI tools.
6. **Hand-fix the sensitive parts.** Auth and payments I write and check myself.

None of these steps is new. What is new is that step 3 is fast, so steps 1, 4 and 5 are where my time goes now.

## Custom skills that force phases

Left alone, an agent will happily build the UI, the database and the business logic in one giant change. That is impossible to review.

So I wrote **custom Claude skills** that force a phase-gated build: **data first, then domain logic, then UI**. Each phase has to work and be reviewed before the next one starts. The skill does not let the agent skip ahead.

This one change did more for code quality than any prompt trick. Small phases mean small diffs, and small diffs are diffs I actually read.

## Numbered prompts for bigger features

For the [3D website generation](/work/greta-3d) feature in Greta, I first researched the best 3D sites on the web with Claude and sorted them into styles. Then I wrote the build plan as a series of **numbered prompts**, one per phase, and built the feature phase by phase.

It went from idea to its own project type in Greta in about **two weeks**. Along the way I generated and reviewed around **180 3D sites** to tune quality. Testing at volume showed patterns that one demo never would.

## Use the AI as the test client too

For the MCP server, Claude was not only the pair programmer. It was also the **test client**. I had it build real apps and sites through the server and write test reports, and I sorted every bug into "MCP" or "platform" so each fix landed in the right layer. Before launch, that meant **12 sites built end to end** through the MCP.

## What I never hand to the agent

- **Auth and payments.** I write or rewrite these myself and test them by hand. With Clipmetry that meant Razorpay subscriptions in INR and USD. With the Greta app it meant StoreKit 2 and Google Play Billing.
- **The final decision on a diff.** The agent proposes. I approve.
- **What counts as done.** The plan sets it, and I check it.

## Is this vibe coding?

I call myself a vibe coder, and I mean it as a compliment. But vibe coding only works in production if the vibes come with a plan, small phases and a human who reads every diff. Speed without review is just a faster way to ship bugs.

If you are hiring an engineer who can move fast with AI agents and still own what ships, [let's talk](/contact). My [resume](/resume.pdf) has the details.
