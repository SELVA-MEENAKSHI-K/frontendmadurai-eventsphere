<div align="center">

# Madurai EventSphere

### Discover events. Find your community. Build something in Madurai.

A local event discovery platform for students, founders, and organizers—bringing
hackathons, workshops, bootcamps, meetups, and community events into one place.

[Open the app](https://frontendmadurai-eventsphere.vercel.app/) ·
[View the source](https://github.com/SELVA-MEENAKSHI-K/frontendmadurai-eventsphere)

</div>

---

## Table of Contents

- [Why EventSphere?](#why-eventsphere)
- [What You Can Do](#what-you-can-do)
- [How It Works](#how-it-works)
- [Kiro University Lessons](#kiro-university-lessons)
- [Technology](#technology)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Accessibility](#accessibility)
- [Project Direction](#project-direction)

## Why EventSphere?

Event information is often scattered across social media, college groups, and
organizer pages. Students may miss useful opportunities, while organizers need
a straightforward way to share events with the local community.

Madurai EventSphere brings event discovery and organizer workflows together. It
helps people find relevant events, understand the details, save opportunities,
and keep track of their participation.

## What You Can Do

### Discover events

- Browse and search event listings.
- Filter events by category, domain, area, and date.
- Open an event to see its description, venue, eligibility, deadline, and
  registration information.
- Explore events in a calendar.
- View event locations on a map when location coordinates are available.

### Keep track of events

- Sign in or create an account.
- Bookmark events for later.
- View saved events on a protected bookmarks page.
- View and update profile information.
- Review event registrations.

### Publish and manage events

- Open the organizer dashboard.
- Create an event with its details and location.
- Edit an existing event.
- Manage event publishing through organizer tools.

### Explore with demo data

Sample Madurai events and demo flows help people explore the application when
live backend services are unavailable or not configured. Demo data is intended
for demonstration and does not guarantee that changes are saved to the
production API.

## How It Works

```mermaid
flowchart LR
    Visitor[Visitor] --> Browse[Browse and filter events]
    Browse --> Details[View event details]
    Details --> SignIn[Sign in or use demo mode]
    SignIn --> Save[Bookmark an event]
    SignIn --> Register[View registration flow]

    Organizer[Organizer] --> Dashboard[Organizer dashboard]
    Dashboard --> Create[Create an event]
    Dashboard --> Edit[Edit an event]
    Create --> Publish[Manage event publishing]
    Edit --> Publish
