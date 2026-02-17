# AGENTS.md

This file provides guidance for AI agents and contributors working in this repository.

It defines project intent, scope boundaries, coding standards, and working principles.

If anything is unclear, follow this document.

---

## Who We Are

We are **Upcraft Crew** — a web engineering studio with two core tracks:

1. **Codebase Refactoring & Stabilization** (primary day-to-day work)
2. **Operational Workflow Systems** (bounded process tools)

We are engineers first — not a feature factory, not a generic dev shop.

We work across the modern web stack. **Convex is a deep specialty**, but we are not limited to it.

---

## Track A — Codebase Refactor & Stabilization

This is the majority of our work.

We are frequently brought into **existing startups and businesses** to fix, refactor, and stabilize their codebases. This work is **technical-first**, not business-process-first.

### What We Do

- Refactor database schemas and data models (Convex, Supabase, Postgres, etc.)
- Redesign query patterns for correctness and performance
- Remove bottlenecks and introduce proper data access patterns
- Clean up authorization logic and access control
- Restructure frontend applications (Next.js, React, WordPress)
- Improve performance and reliability of production systems
- Document architecture for team handoff
- Introduce proper TypeScript patterns and type safety
- Stabilize CI/CD, deployment, and error monitoring
- Migrate between stacks when justified

### Technologies We Work With

We are **stack-flexible** — we go where the client's codebase is.

**Deep expertise:**

- Convex (schemas, functions, aggregates, components, migrations)
- Next.js (App Router, RSC, server actions, layouts)
- TypeScript (strict mode, proper patterns)
- React (functional components, hooks, composition)

**Experienced with:**

- Supabase (Postgres, auth, realtime, edge functions)
- WordPress (theme development, custom plugins, headless)
- React Native / Expo (mobile apps)
- Node.js / Express
- TailwindCSS
- Clerk, Auth.js, NextAuth
- Prisma, Drizzle
- Vercel, Netlify, Railway

We don't limit ourselves to one stack. If a client runs WordPress, we work in WordPress. If they're on Supabase, we work in Supabase. If they need a Next.js + Convex refactor, that's where we shine brightest.

### Convex-Specific Expertise

Convex is our **deepest technical specialty**. Common patterns we implement:

- **Schema design**: normalized tables, proper indexes, denormalization where justified
- **Query optimization**: replacing `.collect()` + `.filter()` with indexed queries
- **Aggregates**: using `@convex-dev/aggregate` for counts, sums, leaderboards
- **Components**: adopting Convex components for rate limiting, migrations, crons
- **Authorization**: centralized auth checks, row-level security patterns
- **Mutations**: idempotent mutations, optimistic updates, proper error handling
- **Actions**: external API calls, file processing, background jobs
- **Real-time**: leveraging Convex reactivity correctly, avoiding unnecessary re-renders
- **Migrations**: safe data migrations without downtime

### How This Work Looks

Agents must assume that many tasks involve:

- Navigating **existing codebases** we didn't write
- Minimizing breaking changes in production systems
- Incremental refactors — not full rewrites
- Preserving production behavior while improving internals
- Reading and understanding unfamiliar code before changing it
- Working within existing conventions unless explicitly asked to change them
- Adapting to whatever stack the client uses

### Standards for Refactor Work

1. Understand the existing code before changing it
2. Prefer surgical changes over sweeping rewrites
3. Maintain backward compatibility unless explicitly scoped otherwise
4. Add types where they're missing — don't remove existing ones
5. If a refactor risks breaking production, flag it and propose a migration path
6. Document non-obvious architectural decisions
7. Test critical paths — don't assume "it worked before"

---

## Track B — Operational Workflow Systems

We also build **focused operational tools** that replace broken manual processes.

This track is **business-outcome-first**, not technology-first.

### Our Core Belief

Clients don't want React or Convex or Supabase — they want:

- Less manual work
- More predictability
- Fewer errors
- Better visibility

We frame everything in terms of **business impact**.

### What We Solve

We solve **one workflow problem at a time**, not entire backoffice systems.

Examples of solvable workflows:

- Material request → approval → confirmation
- Field team activity logging → dashboard
- Compliance form automation → validation → export
- Approval bottleneck flows → digital process control

These are _bounded, discrete workflows_ with clear scope and measurable outcomes.

### What We Don't Build

We are strict about scope boundaries. We do NOT build:

- Full ERP systems
- Accounting / payroll / purchasing / HR systems
- Full inventory valuation platforms
- Generalized CRMs
- Broad ecosystem software
- Permanent custom platforms for small businesses

If a request implies ecosystem scale, legacy ERP integration, or multi-domain software, we **flag and refuse until scoped**.

### Delivery Model (Workflow Track)

We follow a **two-stage delivery model**:

#### Stage 1 — Architecture Sprint

Duration: ~2–3 weeks

Goals:

- Map current process
- Identify bottlenecks and unknowns
- Define solution outline
- Assess integration risk
- Produce a fixed build scope

Deliverables:

- Workflow diagram
- Architecture outline
- Risk map
- Fixed proposal

#### Stage 2 — Implementation Sprint

Build only what was scoped in Stage 1. No hidden scope expansion. No surprise integrations.

### Pricing (Workflow Track)

We price based on **complexity band**, not hours:

- **Band 1 — Standalone Workflow**: No external dependencies, contained scope
- **Band 2 — Moderate Integrations**: 1–2 external APIs, predictable sync
- **Band 3 — Legacy / Enterprise**: Complex, high-risk, requires extended discovery

Band 3 work needs explicit approval before quoting.

---

## Scope Boundaries (Both Tracks)

**Allowed:**

- Single workflow or bounded feature
- Internal dashboard
- Approval automation
- Data logging + reporting
- Schema/query refactoring
- Performance optimization
- Architecture cleanup
- Stack migration (when scoped)
- Simple imports
- Clear exit criteria

**Disallowed:**

- ERP replacement
- Full accounting systems
- Payroll / HR
- Purchasing systems
- Open-ended integration requests
- Feature backlog without priority
- Full rewrites without migration plan

If a request moves toward _platform_, _ecosystem_, or _ERP_, STOP and **re-scope**.

---

## Our Positioning

> _We help startups and businesses stabilize their codebases and replace broken team workflows with simple internal systems._

### Positioning Rule

Always position by **problem solved**, not by industry label.

- Good: "We fix slow queries, release regressions, and fragile architecture."
- Bad: "We only work with SaaS startups."

Industry examples are useful as proof, but our primary message must describe the pain we remove.

This positioning covers both tracks:

- **Track A**: "We fix your codebase" — refactors, performance, architecture (any stack)
- **Track B**: "We fix your workflow" — bounded operational tools

We are:

- Web engineering specialists (TypeScript, React, Next.js, Convex, Supabase, WordPress, and more)
- Codebase stabilizers
- Operational problem solvers
- Impact-focused partners

We are not:

- A "Convex only" shop (it's a specialty, not a limitation)
- A generic dev agency
- A "build whatever you want" shop
- A staffing company

---

## Maintenance Policy

We _do not_ assume permanent ownership of client systems.

After delivery:

- Deliver code + documentation
- Optionally offer maintenance retainer

Retainers are limited to monitoring, small tweaks, and incremental improvements — not full product support.

---

## Sales & Discovery Framework

### Track A (Refactor/Stabilization)

- Initial codebase review (often free or low-cost)
- Identify top 3-5 architectural issues
- Propose phased refactor plan
- Execute in bounded sprints
- Works regardless of stack — Convex, Supabase, WordPress, plain React, etc.

### Track B (Workflows)

- Workflow Audit calls
- Paid Architecture Sprints
- Pattern learning from 10+ conversations
- Data-led scope

We do NOT estimate builds without first reducing unknowns.

---

## What Success Looks Like

### Track A (Refactor)

- Codebase is cleaner, faster, more maintainable
- Team can ship features without fear
- Queries run efficiently at scale
- Architecture is documented and understandable
- No production regressions from our changes

### Track B (Workflows)

- Solves ONE documented business problem
- Replaces manual work
- Has clear exit criteria
- Teaches client a reproducible process
- Produces reusable templates

We learn from each delivery to systemize the next.

---

## Internal Rules (for Agents)

1. **Read before you write.** Understand existing code before changing it.
2. Favor _bounded changes_ over _sweeping rewrites_.
3. Favor _clarity of scope_ over _engineering creativity_.
4. Favor _predictable delivery_ over _open-ended engineering_.
5. If scope expands, **re-run discovery**.
6. Clients pay for reducing unknowns before builds.
7. When working in existing codebases, **preserve production behavior** unless explicitly asked to change it.
8. Prefer **incremental refactors** with clear rollback paths.
9. Always check for existing patterns before introducing new ones.
10. Document why, not just what.
11. **Adapt to the client's stack** — don't force technology choices.
12. **Write copy problem-first** — lead with pains and outcomes, not demographics or sectors.

---

## Tech Stack

Primary (what we use most):

- **TypeScript** — strict mode, no `any` unless justified
- **Next.js** — App Router, RSC, server actions
- **Convex** — reactive backend, schemas, functions, components
- **React** — functional components, hooks, composition
- **TailwindCSS** — utility-first styling

Frequently used:

- **Supabase** — Postgres, auth, realtime, edge functions
- **WordPress** — themes, plugins, headless setups
- **Clerk** — authentication
- **React Native / Expo** — mobile apps

Supporting:

- Resend (transactional email)
- shadcn/ui (component library)
- Motion (animations)
- Zod (validation)
- Prisma, Drizzle (ORMs)
- Vercel, Netlify, Railway (hosting)

---

## Summary

Upcraft Crew exists to:

1. **Stabilize codebases** — refactor, optimize, document, across any modern web stack (Track A)
2. **Replace broken workflows** — bounded operational tools (Track B)

Convex is our deepest specialty, but we work wherever the code lives.

We are **engineers first** — whether we're deep in a Convex schema refactor, cleaning up a WordPress site, optimizing Supabase queries, or building an approval workflow from scratch.

Operate within scope.
Deliver measurable outcomes.
Read before you write.
Avoid platform traps.
Sell the problem solved — not the tech used.
