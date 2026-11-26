---
title: What I learned shipping a production remote MCP server
description: How I built Greta's remote MCP server so Claude, ChatGPT and Cursor can build and deploy real apps safely: Streamable HTTP, OAuth 2.1, long-running builds, credit caps and two-step approvals.
date: 2026-11-26
keywords: remote MCP server, production MCP server, Model Context Protocol, MCP OAuth 2.1, Streamable HTTP MCP, MCP server guardrails, MCP developer, Claude MCP server
---

Most MCP tutorials stop at a demo that reads a file or calls a weather API. I built one that spends real money and publishes real websites. It is [Greta's MCP server](/work/greta-mcp), and it went live for every production user in mid October 2026.

Here is what actually mattered when an AI agent, not a person, is the one pressing the buttons.

## The setup: remote, nothing to install

Greta is an AI app builder. You describe a product and it builds a hosted project with a live URL. The goal was to let people do all of that from the assistant they already use: Claude, ChatGPT, Cursor or VS Code.

So the server is **remote**. You add one URL as a connector and sign in. There is nothing to install or run.

- Transport: **Streamable HTTP**
- Auth: **OAuth 2.1**, so the client opens a browser and the person signs in with their own Greta account
- In Claude Code it is one line: `claude mcp add greta --transport http https://mcp.greta.sh`

A local stdio server would have been easier to write. It would also have meant asking non-developers to install things. Remote plus OAuth was the only option that worked for everyone.

## Problem 1: builds outlast a tool call

An app build takes minutes. MCP clients and proxies time out in about a minute. If a tool call waits for the build, it fails, even though the build is fine.

What I did:

- A "generating" status is a **normal, successful reply**, not an error. The work keeps running on the server.
- A free status tool reports progress, stalls, questions the builder is waiting on, and what the turn spent. The agent polls it.
- Every paid call takes a `requestId`, so a retry after a dropped connection never charges twice.

> Long-running work needs an async contract: return early, keep working, make polling cheap and make retries safe.

## Problem 2: money

An agent can call tools in a loop. Many Greta actions cost credits. I treated credits as a risky edge and designed it first:

- Every paid call reports what it spent, in its own response.
- Every paid call accepts an optional `creditBudget`. If the estimate is over the budget, nothing runs and nothing is charged.
- A balance tool lets the agent check before it starts.

The person stays in control of spend even when they are not watching each call.

## Problem 3: anything that goes live

Publishing a page to a live site cannot be undone. Neither can approving content that goes out on a schedule. For those actions I used a **two-step approval**:

1. The first call only previews what would happen and returns a `confirmToken`. Nothing changes.
2. The agent shows the change to the person and waits for their own words of approval.
3. Only a second call that carries the token and the approval actually applies it.

This one pattern removed a whole class of "the agent did something I didn't ask for" problems.

## Problem 4: the agent has no manual except your tool descriptions

The server grew to **45+ tools** across building, templates, themes, deploy and publish, growth, and credits. With that many tools, the agent's choice of tool is the product.

I iterated on names and descriptions until agents picked the right tool on their own, and I raised the server's Smithery quality score from **56 to 98** along the way. I wrote that up separately: [How I raised our MCP server's quality score from 56 to 98](/blog/mcp-tool-descriptions-smithery-score).

One small rule helped a lot: the build tool requires the agent to state which kind of project the person chose. The agent never guesses what to build.

## Testing it the way users use it

Unit tests were necessary but not enough. The growth release alone added 9 new site actions (9 to 18) with **29 test files** passing. But the real bugs showed up only through a real AI client.

So I used Claude itself as the test client. Before launch I built **12 sites end to end** through the MCP: landing pages, 3D websites, self-growing sites and full-stack apps. Every issue went into one of two buckets:

- **MCP**: an empty tool response, a missing tool for something only the web UI could do
- **Platform**: the builder, the growth engine, analytics, billing

That split kept every fix in the right layer instead of patching platform bugs inside the MCP server.

## What I would tell someone building their first production MCP server

- For an AI agent, **the tool description is the product**. Spend real time on names and wording.
- Put **guardrails on money and irreversible actions**: caps, cost in every response, and a confirmation step.
- Design **async from day one** if anything takes longer than a few seconds.
- Share business logic with your web app. Approve, discard and publish should run through one code path for both.
- Test through a **real client**, not just with unit tests.

The public setup guide is on [GitHub](https://github.com/Questera-Marketing/greta-mcp), and the full story with diagrams is in the [Greta MCP server case study](/work/greta-mcp).

If you are hiring someone who has shipped MCP servers and AI agent tooling to production, [get in touch](/contact).
