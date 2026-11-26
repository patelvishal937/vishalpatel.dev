---
title: How I raised our MCP server's quality score from 56 to 98
description: Tool names and descriptions decide whether an AI agent uses your MCP server well. Here is how I took Greta's MCP server from a Smithery quality score of 56 to 98, and the checklist I use now.
date: 2026-11-26
keywords: MCP tool descriptions, Smithery quality score, MCP best practices, how to write MCP tools, MCP server tool naming, AI agent tool design, Model Context Protocol tools
---

When I started optimising Greta's MCP server, its Smithery quality score was **56 out of 100**. When I finished, it was **98**. I did not add features to get there. I rewrote words.

That is the whole lesson, really. For an AI agent, your tool names and descriptions are the only manual it gets. If they are vague, the agent guesses. If they overlap, it picks the wrong one.

## Why this matters more than it looks

Greta's server has **45+ tools**: building apps by chat, templates, themes, deploy and publish, growth for self-growing sites, and credits. A person reading docs can skim and figure it out. An agent cannot. It reads the tool list, picks one, and runs it, sometimes with real money and real publishing on the line.

So a confusing description is not a cosmetic issue. It turns into wrong actions.

## What moved the score

I iterated against the score and checked the result with real agents each time. A few things made the biggest difference.

### 1. Names were the last points

The final points came from **tool naming**, not descriptions. Consistent, predictable names let an agent find the right tool before it even reads the description. I settled on clear verb-plus-object names like `create_project`, `get_generation_status` and `publish_site`, and kept the same verbs across every group.

### 2. Say when to use it, and when not to

The worst real bug was two tools that sounded alike. Agents kept confusing an **older nightly-loop approval** with the **newer Automatic growth items**. Both "approved" something. The fix was not code. Each description now says which flow it belongs to and points to the other one for the other case.

### 3. Make the agent state intent

The build tool requires the agent to say which kind of project the person chose: a full-stack app, a self-growing website or a 3D website. The agent cannot quietly guess. If the person did not say, the agent has to ask.

### 4. Put cost and side effects in the description

If a tool spends credits, the description says so, and the response reports what it spent. If a tool changes something live, the description says it is a two-step call that first returns a preview and a `confirmToken`. Agents behave much more carefully when the description tells them the stakes.

### 5. Describe what comes back

A good description says what the agent will get and what to do next. For long builds: "a generating status is success; poll the status tool". Without that line, agents treated a normal in-progress reply as a failure and retried.

## My checklist for MCP tool descriptions

- One clear **verb_object** name, same verbs across the whole server
- First sentence: what it does, in plain words
- **When to use it, and when to use a different tool instead**
- Required inputs the agent must ask the person for, not guess
- Cost in credits or money, and whether it can be capped
- Whether it changes anything live, and if so, how confirmation works
- What the response contains and what the agent should do next

## The takeaway

I used to think of descriptions as documentation. Now I treat them as the interface. The agent is the user, and the words are the UI.

The full write-up of the server, including OAuth 2.1, long-running builds and credit caps, is in [What I learned shipping a production remote MCP server](/blog/shipping-a-production-remote-mcp-server) and the [Greta MCP server case study](/work/greta-mcp).

Building an MCP server or AI agent tools and need help? [Get in touch](/contact).
