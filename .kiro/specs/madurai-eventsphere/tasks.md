# Madurai EventSphere — Implementation Tasks

**Project:** Madurai EventSphere  
**Challenge:** Kiro University Challenge 2026  
**Version:** 1.0  
**Date:** September 2026  
**Status:** In Progress

---

## Task Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

---

## Phase 1 — Project Foundation & Setup

| Task | Description | Status |
|---|---|---|
| T1-01 | Initialize frontend (Vite + React + Tailwind) | `[x]` |
| T1-02 | Initialize backend (Express + Vercel serverless) | `[x]` |
| T1-03 | Configure Supabase project + tables + RLS | `[ ]` |
| T1-04 | Connect backend to Supabase | `[ ]` |
| T1-05 | Connect frontend to backend | `[x]` |
| T1-06 | Build Navbar and App shell | `[x]` |
| T1-07 | Deploy skeleton to Vercel | `[ ]` |

---

## Phase 2 — Core Event Discovery

| Task | Description | Status |
|---|---|---|
| T2-01 | Build EventCard component + EventBadge | `[x]` |
| T2-02 | Build EventGrid + HomePage layout | `[x]` |
| T2-03 | Implement filter bar (category, domain, location, date) | `[x]` |
| T2-04 | Implement keyword search with 300ms debounce | `[x]` |
| T2-05 | Build interactive Leaflet map with category markers | `[x]` |
| T2-06 | Build Event Detail Page with Register Now / Closed logic | `[x]` |

---

## Phase 3 — Authentication & Bookmarks

| Task | Description | Status |
|---|---|---|
| T3-01 | Set up Supabase Auth + profile trigger | `[ ]` |
| T3-02 | Build AuthContext + Login/Register pages | `[x]` |
| T3-03 | Wire JWT to backend API calls | `[x]` |
| T3-04 | Implement bookmarks (API + UI + BookmarksPage) | `[ ]` |

---

## Phase 4 — Organizer Dashboard

| Task | Description | Status |
|---|---|---|
| T4-01 | Build EventForm + LocationPicker + EventCreatePage | `[ ]` |
| T4-02 | Build Organizer Dashboard (list, publish toggle, delete) | `[ ]` |
| T4-03 | Build Event Edit Page | `[ ]` |
| T4-04 | Final polish + accessibility pass | `[ ]` |
| T4-05 | Production deployment + environment validation | `[ ]` |

---

## Phase 5 — Correctness (Kiro University Lesson 4)

| Task | Description | Status |
|---|---|---|
| T5-01 | Define universal properties from FR-01, FR-02, FR-03, FR-04 | `[x]` |
| T5-02 | Write property-based tests for `dateUtils.js` (P1–P17 + boundaries) | `[x]` |
| T5-03 | Write property-based tests for `constants.js` (P4–P8, P18–P20) | `[x]` |
| T5-04 | Write property-based tests for `mapUtils.js` (P-M1–P-M8) | `[x]` |
| T5-05 | Write property-based tests for `eventService` filter logic (P-F1–P-F7) | `[x]` |
| T5-06 | Run full test suite — all tests pass (119+ tests) | `[x]` |

**Test files:**
- `src/utils/__tests__/dateUtils.test.js`
- `src/utils/__tests__/constants.test.js`
- `src/utils/__tests__/mapUtils.test.js`
- `src/services/__tests__/eventService.filterParams.test.js`

Run with: `npm test`
