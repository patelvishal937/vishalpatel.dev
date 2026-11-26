---
title: "MCP tool descriptions: how I raised our Smithery score from 56 to 98"
seoTitle: MCP tool descriptions best practices
description: Names and descriptions decide whether an AI agent uses your MCP server well. How I took Greta's MCP server from a Smithery score of 56 to 98, with a checklist.
date: 2026-11-26
keywords: MCP tool descriptions, MCP tool description best practices, Smithery quality score, MCP tool naming conventions, how to write MCP tools, AI agent tool design
---

Greta's MCP server had a Smithery quality score of **56 out of 100**. I raised it to **98** by rewriting its tool names and descriptions for AI agents, until agents picked the right tool on their own.

That is the whole lesson. For an AI agent, your tool names and descriptions are the only manual it gets. If they are vague, the agent guesses. If two of them overlap, it picks the wrong one.

## Why this matters more than it looks

Greta's server has **45+ tools**: building apps by chat, templates, themes, deploy and publish, growth for self-growing sites, and credits. A person reading docs can skim and figure it out. An agent cannot. It reads the tool list, picks one, and runs it, sometimes with real money and real publishing on the line.

So a confusing description is not a cosmetic issue. It turns into wrong actions.

## What I changed

### 1. One naming pattern for every tool

Agents find the right tool faster when names are predictable. Greta's tools use **verb_object** names in snake_case, like `create_project`, `get_generation_status` and `publish_site`. Keep the same verbs across every group: if one group says `get_` and another says `fetch_`, the agent has to guess whether they behave differently.

### 2. Say when to use it, and when not to

Tools that sound alike lead to wrong calls. When two tools could be confused, each description should say which job it is for and name the other tool for the other job.

### 3. Make the agent state intent

The build tool requires the agent to say which kind of project the person chose: a full-stack app, a self-growing website or a 3D website. The agent cannot quietly guess. If the person did not say, the agent has to ask.

### 4. Put cost and side effects in the description

Every paid Greta tool reports what it spent in its response, and risky ones are two-step calls that first return a preview and a `confirmToken`. The description is where the agent learns that before it calls. Write the stakes where the agent reads them.

### 5. Describe what comes back

A good description says what the agent will get and what to do next. For long builds: a "generating" status is a success, and the next step is to poll the status tool. Without that line, an agent can read a normal in-progress reply as a failure and retry.

## Test with a real agent, not only the score

A quality score can check that tools are described and inputs are documented. It cannot tell you whether an agent picks the right tool. For that I used Claude as the test client before launch. Watching a real agent choose tools shows you which descriptions still leave room to guess.

## My checklist for MCP tool descriptions

- One clear **verb_object** name, same verbs and casing across the whole server
- First sentence: what it does, in plain words
- **When to use it, and which tool to use instead**
- Required inputs the agent must ask the person for, not guess
- Cost in credits or money, and whether it can be capped
- Whether it changes anything live, and if so, how confirmation works
- What the response contains and what the agent should do next
- A description for every input, not just the tool
- MCP tool annotations such as `readOnlyHint` and `destructiveHint`, so clients know which calls are safe

## FAQ

### What is a good length for an MCP tool description?

Long enough to answer the checklist above, and no longer. Put the most important sentence first, so the key fact is there even if nothing else is read.

### Does the Smithery quality score matter?

It is a useful check on the basics of your tool list. Treat it as the floor. The real test is whether an agent picks the right tool when you give it a real task.

## The takeaway

I used to think of descriptions as documentation. Now I treat them as the interface. The agent is the user, and the words are the UI.

The full write-up of the server, including OAuth 2.1, long-running builds and credit caps, is in [What I learned shipping a production remote MCP server](/blog/shipping-a-production-remote-mcp-server) and the [Greta MCP server case study](/work/greta-mcp).

Building an MCP server or AI agent tools and need someone who has shipped one? [Get in touch](/contact).
