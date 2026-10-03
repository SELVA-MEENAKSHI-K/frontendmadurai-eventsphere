# eventsphere-helper

A [Kiro Power](https://kiro.dev/docs/powers/) for the **Madurai EventSphere** project.

Gives any Kiro agent working on this codebase immediate context about frontend conventions,
backend patterns, Supabase schema, and API contracts — no repo exploration required.

## Install

In Kiro's Powers panel → **+ Add Custom Power** → paste the repo URL:

```
https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere
```

Select `powers/eventsphere-helper` as the power root.

## What's inside

```
powers/eventsphere-helper/
  POWER.md                          ← Kiro Power manifest
  plugin.json                       ← machine-readable metadata
  README.md                         ← this file
  skills/
    event-development/
      SKILL.md                      ← full project coding guide
```

## Skills

| Skill | Description |
|---|---|
| `event-development` | Frontend rules, backend patterns, Supabase schema, API reference, env var guide |

## Tech stack covered

React 18 · Vite · Tailwind CSS · React Router v6 · Axios · Node.js · Express · Supabase (PostgreSQL + Auth + RLS)
