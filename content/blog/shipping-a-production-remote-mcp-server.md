---
title: What I learned shipping a production remote MCP server
seoTitle: Production remote MCP server: lessons learned
description: How I built a remote MCP server that AI agents use to build and publish real apps: OAuth 2.1, Streamable HTTP, slow tool calls, credit caps and approvals.
date: 2026-11-26
keywords: remote MCP server, production MCP server, MCP OAuth 2.1, Streamable HTTP, MCP long running tasks, MCP tool timeout, MCP human in the loop, MCP server developer
---

Most MCP tutorials stop at a local demo that reads a file or calls a weather API. I built a remote MCP server that spends real money and publishes real websites. It is [Greta's MCP server](/work/greta-mcp), and it went live for every production user in mid October 2026.

This post covers four problems you only meet in production: auth, tool calls that outlast the client's timeout, money, and actions that cannot be undone.

## The setup: remote, nothing to install

Greta is an AI app builder. You describe a product and it builds a hosted project with a live URL. The goal was to let people do all of that from the assistant they already use: Claude, ChatGPT, Cursor or VS Code.

So the server is **remote**. You add one URL as a connector and sign in. There is nothing to install or run.

- Transport: **Streamable HTTP**
- Auth: **OAuth 2.1**, so the client opens a browser and the person signs in with their own Greta account. The agent acts on that person's account and credits, never a shared key
- In Claude Code it is one line: `claude mcp add greta --transport http https://mcp.greta.sh`

A local stdio server would have been easier to write. It would also have meant asking non-developers to install things. Remote plus OAuth was the only option that worked for everyone.

## Problem 1: builds outlast a tool call

An app build takes minutes. MCP clients and proxies often give a single tool call much less time than that. If the tool call waits for the build, the client gives up, even though the build is fine.

What I did:

- A "generating" status is a **normal, successful reply**, not an error. The work keeps running on the server.
- A free status tool reports progress. The agent polls it until the build is done.
- Every paid call takes a `requestId`, so a retry after a dropped connection never charges twice.

> Long-running work needs an async contract: return early, keep working, make polling cheap and make retries safe.

For a real call, it looks like this:

```text
create_project         kind: self_growing, creditBudget: 20
get_generation_status  generating, 3 of 5 steps
get_generation_status  done, spent 11.4 credits
publish_site           live
```

The MCP project now has an official [Tasks extension](https://modelcontextprotocol.io/extensions/tasks/overview) for this same problem. The idea is the same: start the work, hand back something to check on, and let the client come back.

## Problem 2: money

An agent can call tools in a loop. Many Greta actions cost credits. I treated credits as a risky edge and designed it first:

- Every paid call reports what it spent, in its own response.
- Every paid call accepts an optional `creditBudget`. If the estimate is over the budget, nothing runs and nothing is charged.
- A balance tool lets the agent check before it starts.

The person stays in control of spend even when they are not watching each call.

## Problem 3: anything that goes live

Publishing a page to a live site cannot be undone. Many MCP setups rely on the client to show an "allow this tool?" prompt. That prompt depends on the client, and people learn to click through it.

So I put the approval **in the server** as a two-step call:

1. The first call only previews what would happen and returns a `confirmToken`. Nothing changes.
2. The agent shows the change to the person and waits for their own words of approval.
3. Only a second call that carries the token actually applies it.

The server enforces it, whichever client is connected. The person stays in charge of anything that cannot be undone.

## Problem 4: the agent has no manual except your tool descriptions

The server grew to **45+ tools** across building, templates, themes, deploy and publish, growth, and credits. With that many tools, the agent's choice of tool is the product.

I rewrote the tool names and descriptions until agents picked the right tool on their own, and the server's Smithery quality score went from **56 to 98** along the way. I wrote that up separately: [MCP tool descriptions: how I raised our Smithery score from 56 to 98](/blog/mcp-tool-descriptions-smithery-score).

## Testing it the way users use it

Unit tests were necessary but not enough. The growth release alone took the site actions from 9 to 18 with **29 test files** passing. But some bugs only show up when a real AI client drives the server.

So I used Claude itself as the test client. Before launch I built **12 sites end to end** through the MCP. Every issue went into one of two buckets: **MCP** or **platform**. That split kept every fix in the right layer instead of patching platform bugs inside the MCP server.

## Checklist for your first production MCP server

- For an AI agent, **the tool description is the product**. Spend real time on names and wording.
- Put **guardrails on money and irreversible actions** in the server: caps, cost in every response, and a confirmation step.
- Design **async from day one** if anything takes longer than a few seconds.
- Share business logic with your web app, so approve, discard and publish behave the same everywhere.
- Test through a **real client**, not just with unit tests.

## FAQ

### Should my MCP server be remote or local?

If your users are not developers, remote. A remote server over Streamable HTTP with OAuth 2.1 is one URL and a sign-in. A local stdio server is fine for developer tools that need files on the machine.

### How do I handle an MCP tool that takes minutes?

Return early with a status, keep the work running on the server, and give the agent a cheap status tool to poll. Make paid calls safe to retry with an idempotency key such as a `requestId`.

### How do I stop an agent from publishing something by mistake?

Do not rely only on the client's permission prompt. Make risky tools two-step on the server: preview first with a token, then apply only when the second call brings that token back after the person approves.

The public setup guide is on [GitHub](https://github.com/Questera-Marketing/greta-mcp), and the full story with diagrams is in the [Greta MCP server case study](/work/greta-mcp).

If you are hiring someone who has shipped MCP servers and AI agent tooling to production, [get in touch](/contact).
