---
name: "eventsphere-helper"
version: "1.0.0"
displayName: "EventSphere Helper"
description: "Reusable development guidance for the Madurai EventSphere React, Express, and Supabase project. Provides coding standards, frontend patterns, backend conventions, and schema context."
keywords: ["eventsphere", "react", "vite", "tailwind", "express", "supabase", "madurai"]
author: "SELVA-MEENAKSHI-K"
---

# EventSphere Helper

A Kiro Power that gives any agent working on the **Madurai EventSphere** project immediate, accurate context about the codebase — frontend conventions, backend patterns, Supabase schema, and API contracts — without needing to explore the repo from scratch.

## When to use this skill

Activate the `event-development` skill when you are:

- Building or editing a React component in `src/components/` or `src/pages/`
- Writing or updating a backend Express route in `backend/src/routes/`
- Querying or migrating the Supabase database
- Adding or modifying bookmark, auth, or organizer flows

## Skills included

### `event-development`

Covers the full project stack:

- **Frontend rules** — functional components, Tailwind-only styling, `CATEGORY_STYLES` from `constants.js`, `dateUtils` for all date formatting, single Axios instance, null-strip filter pattern
- **Backend rules** — `{ success, data, count }` response envelope, `next(err)` error forwarding, service-role Supabase client only from `lib/supabaseClient.js`
- **Supabase schema** — all four tables (`profiles`, `events`, `bookmarks`, `event_stats`), RLS rules, CHECK constraints, trigger-managed counters
- **API reference** — all endpoints with auth requirements and filter params
- **Environment variables** — which keys go frontend vs backend, what is safe to expose

## How to install

In the Kiro Powers panel, click **+ Add Custom Power** and point it at this repository:

```
https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere
```

Select the `powers/eventsphere-helper` directory as the power root.

## How to use

Once installed, reference the skill in a prompt:

> "Using the event-development skill, create a new EventCard variant that shows a countdown timer."

Or activate it through the Kiro skills panel and it will load project context automatically.
