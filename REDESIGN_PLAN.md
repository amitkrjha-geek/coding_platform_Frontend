# UI/UX Redesign Plan — Hack The Box-Inspired

> **Project:** Violethat Coding Platform (Next.js 15 + Tailwind 3 + Radix UI + Framer Motion)
> **Goal:** Transform the existing UI into a premium, dark-themed, cyber-tech SaaS experience inspired by [hackthebox.com](https://www.hackthebox.com).
> **Constraint:** ZERO changes to business logic, API calls, Redux state, routing, Clerk auth, or component data flow. **Style/layout/motion only.**

---

## 1. Design System Analysis (Hack The Box)

After analyzing HTB's visual language, here are the signature traits we will adopt:

| Pillar | HTB Signature | Adoption in our project |
|---|---|---|
| **Theme** | Dark-first (near-black `#111927`, deep navy panels) with a single neon accent | Dark default + light fallback; neon green primary, violet retained as secondary |
| **Color** | `#9FEF00` (neon green) primary, `#1A2332` panels, `#A4B1CD` muted text, `#FF3E3E` danger | New CSS variables — neon-green primary replaces flat purple; violet kept as a "premium" tier accent |
| **Typography** | Geometric sans (Chivo / Inter-style), tight tracking, ALL-CAPS micro labels, mono for code/stats | Keep `Geist` body + add `JetBrains Mono` for code/numbers/labels. ALL-CAPS uppercase tracker for section eyebrows |
| **Layout** | Generous vertical rhythm, full-bleed dark hero sections, snapped 12-col grid | Standardize section spacing (96/64/32 rhythm), wider max-width on hero, edge-to-edge dark panels |
| **Cards** | Sharp 8–12px corners, 1px subtle border (`rgba(255,255,255,0.06)`), inner glow on hover, neon underline on focus | Refit `ChallengeCard`, `PlanCard`, `CouponCard`, profile cards; remove rounded-2xl gradient blobs |
| **Buttons** | Sharp/slightly-rounded, neon fill OR ghost-with-bracket-corners, animated underline + arrow shift | Replace shadcn button variants — add `variant="neon"`, `variant="hacker-ghost"` |
| **Nav** | Sticky, blurred dark, ALL-CAPS items, neon underline on active, animated dropdowns | Restyle `components/shared/Navbar.tsx` and `components/adminDashboard/Sidebar.tsx` |
| **Animations** | Subtle: 200ms ease-out, hover translateY(-2px), scanline/grid background, terminal-cursor blink, count-up stats | Use existing Framer Motion; add tailored keyframes (scanline, glow-pulse, grid-fade) |
| **Decoration** | Diagonal grid lines, hex/circuit SVG accents, glitch on titles, gradient mesh under hero | New reusable `<GridBg/>`, `<NeonDivider/>`, `<TerminalLabel/>` presentational components |

---

## 2. Guardrails (Do NOT Touch)

These files / concerns are **read-only** for this redesign:

- All `redux/**` slices, thunks, actions
- All `API/**` request modules
- All `hooks/**` business hooks (`useCheckRole`, `useAdminAccess`, etc.)
- `config/token.ts`, Clerk integration in [layout.tsx](app/layout.tsx)
- `app/StoreProvider.tsx`
- Route paths, page filenames, and `params`/`searchParams` contracts
- All `useEffect` data-fetching, `dispatch(...)` calls, form submission handlers, payment-form auto-submit logic in [ChallengeCard.tsx](components/home/ChallengeCard.tsx#L92-L98) and [PricingPlans.tsx](components/billing/PricingPlans.tsx#L51-L58)
- Monaco editor wiring, Tiptap editor wiring, Socket.io client
- Schema validation (Zod), react-hook-form resolvers

**Allowed to touch:** JSX structure (re-arrange/re-wrap markup), `className`, inline `style`, motion variants, decorative children, CSS files, Tailwind config.

---

## 3. Foundation Layer (Done First)

These are the prerequisites — every subsequent page redesign depends on them.

### 3.1 Tailwind tokens — [tailwind.config.ts](tailwind.config.ts)
- Add a custom palette under `theme.extend.colors`:
  - `htb` namespace: `bg`, `panel`, `panel-hover`, `border`, `border-hover`, `muted`, `text`, `text-dim`
  - `neon`: `green` (#9FEF00), `green-dim`, `green-glow`
  - `accent.violet` (retain existing `#7E22CE` for premium tier)
  - Status: `success`, `warn`, `danger` tuned for dark bg
- Add `fontFamily.mono` with `JetBrains Mono`, fallback to existing `--font-geist-mono`
- Extend `boxShadow` with `neon`, `neon-sm`, `panel`, `panel-lg`
- Extend `keyframes`/`animation`: `scanline`, `glow-pulse`, `count-up`, `grid-fade`, `terminal-blink`, `slide-up-fade`
- Add `backgroundImage`: `grid-pattern`, `radial-glow`, `hex-pattern`

### 3.2 Global CSS — [app/globals.css](app/globals.css)
- Replace `:root` HSL tokens with HTB-aligned ones (background `224 71% 4%`, surfaces, border, muted, foreground)
- Default `html` to dark theme; remove the auto-light fallback
- Import `JetBrains Mono` next to existing `Manrope`
- Add utility classes: `.glass-panel`, `.neon-text`, `.neon-border`, `.terminal-eyebrow`, `.bracket-corners`, `.scanline-bg`, `.section-grid-bg`
- Restyle `.gutter` (split panes) for dark theme
- Restyle `.ProseMirror` for dark editor surface
- Remove or recolor `.normal_pricing` / `.popular_pricing` to use neon accent

### 3.3 Shared primitives — [components/ui/](components/ui/)
- **button.tsx** → add variants: `neon` (filled green-on-black), `ghost-neon` (bracket corners, transparent → glow on hover), `violet` (premium tier). Keep all existing variants & API intact for callers.
- **card.tsx** → dark surface, `border-htb-border`, hover lifts with neon ring
- **input.tsx / select.tsx / textarea.tsx** → dark fill, neon focus ring, mono placeholder
- **badge.tsx** → dark pill, ALL-CAPS, mono, color variants for difficulty/status
- **tabs.tsx** → underline-style with neon active indicator (replace pill)
- **table.tsx** → zebra rows on dark, mono numerics, sticky neon header

### 3.4 New presentational primitives (NEW files, no logic)
- `components/shared/GridBackground.tsx` — animated grid SVG layer
- `components/shared/NeonDivider.tsx` — horizontal rule with center diamond
- `components/shared/TerminalEyebrow.tsx` — `> SECTION_NAME` style label
- `components/shared/StatCounter.tsx` — animated count-up wrapper (visual only)
- `components/shared/SectionShell.tsx` — standardized section padding/max-width

---

## 4. Page-by-Page Redesign

Each entry lists the **exact files**, the **visual changes**, and **logic-preservation notes**. Order = recommended implementation order.

### 4.1 Global chrome
- [app/layout.tsx](app/layout.tsx) — add `dark` class to `<html>`, swap body bg to `htb-bg`, keep `ClerkProvider`, `StoreProvider`, `Toaster`, `Navbar` exactly as wired
- [components/shared/Navbar.tsx](components/shared/Navbar.tsx) — dark blurred bar, neon underline `motion.div` (already present, just recolor), ALL-CAPS nav items, restyled `UserButton` wrapper, redesigned mobile drawer; **keep all `useAuth`, `useUser`, `useCheckRole`, `useAdminAccess`, `useState`, `useEffect` hooks identical**
- [components/shared/NotificationDropdown.tsx](components/shared/NotificationDropdown.tsx) — dark panel, neon unread dot

### 4.2 Public landing / Challenges hub — [app/page.tsx](app/page.tsx) → [components/home/Challenges.tsx](components/home/Challenges.tsx)
- Add a hero band above the existing list: terminal eyebrow + headline + stat counters (total challenges, solvers, languages — wired to existing `topicStats`/`challenges` already in Redux; **no new fetches**)
- Restyle topic `<Tabs>` as ghost chips with neon active state
- Restyle search/filter row: dark inputs, mono placeholder, neon focus
- Optionally restore the right-rail `<Sidebar/>` (currently commented) **only if visually improved** — leave commented if unsure
- Keep all `useMemo`, `useEffect`, `useAppSelector`, `useAppDispatch`, Clerk-sync logic untouched

### 4.3 Challenge cards & list — [components/home/ChallengeCard.tsx](components/home/ChallengeCard.tsx), [components/home/ChallengeList.tsx](components/home/ChallengeList.tsx)
- Replace gradient/blob aesthetic with HTB card: dark panel, 1px border, ALL-CAPS difficulty badge, mono submission count, bracket-corner CTA on hover
- Difficulty mapping: easy → neon green, medium → amber, hard → red (kept color semantics)
- **Preserve:** `handleStartChallenge`, `handlePayment`, `handleCheckoutSuccess`, `getUserPaymentHistory` effect, hidden payment-form auto-submit at [ChallengeCard.tsx:92-98](components/home/ChallengeCard.tsx#L92-L98), `<CheckoutPage>` modal mount logic

### 4.4 Challenge detail / IDE — [app/(root)/[q_id]/page.tsx](app/(root)/[q_id]/page.tsx) and tabs in [components/home/code/](components/home/code/)
- Dark IDE chrome around Monaco; recolor split-pane `.gutter`
- Restyle tabs (`DescriptionTab`, `SubmissionsTab`, `AcceptedTab`, `LogsTab`, `SolutionHintTab`) with HTB tab underline + dark surface
- **Preserve:** Monaco config, all socket listeners, run/submit handlers, redux dispatches

### 4.5 Billing / Pricing — [app/(root)/billing/page.tsx](app/(root)/billing/page.tsx) and [components/billing/](components/billing/)
- `PricingHeader` — dark hero with grid bg, neon eyebrow
- `PricingPlans` / `PricingFeatures` — sharp dark cards; the popular plan gets a neon green border + glow (re-style existing `.popular_pricing`)
- `Testimonials` — dark cards, mono attribution
- `FAQ` — dark accordion with neon plus/minus
- `CheckoutModal` / `CheckoutPage` — dark surface only
- **Preserve:** `dispatch(fetchPlans())`, `handlePlanSelect`, payment-form submit effect at [PricingPlans.tsx:51-58](components/billing/PricingPlans.tsx#L51-L58), Clerk auth gates

### 4.6 Profile area — [app/(root)/profile/page.tsx](app/(root)/profile/page.tsx) + [components/profile/](components/profile/)
- `ProfileSidebar`, `ProfileStats`, `RecentSubmissions`, `SubmissionHistory`, `PaymentHistory` — dark cards, mono stats, neon accents on active stats
- **Preserve:** `searchParams` reads, Redux selectors, all data tables' source data

### 4.7 Submissions — [app/(root)/submissions/page.tsx](app/(root)/submissions/page.tsx)
- Dark table, mono columns, status badges (passed/failed/pending) recolored
- **Preserve:** Redux source, pagination handlers

### 4.8 Notifications — [app/(root)/notifications/page.tsx](app/(root)/notifications/page.tsx)
- Dark list with neon unread indicator

### 4.9 Auth pages — [app/sign-in/[[...sign-in]]/page.tsx](app/sign-in/[[...sign-in]]/page.tsx), [app/sign-up/[[...sign-up]]/page.tsx](app/sign-up/[[...sign-up]]/page.tsx)
- Center the Clerk `<SignIn/>` / `<SignUp/>` widget on a dark hero with grid-bg + side panel branding
- Pass Clerk `appearance` prop to recolor inputs/buttons to neon theme — **no behavioral changes**

### 4.10 Admin dashboard — [app/admin/](app/admin/) + [components/adminDashboard/](components/adminDashboard/)
- [Sidebar.tsx](components/adminDashboard/Sidebar.tsx) — dark rail, neon active item, ALL-CAPS labels, animated chevron toggle preserved
- [Navbar.tsx](components/adminDashboard/Navbar.tsx) — match shared navbar styling
- Charts ([RevenueChart](components/adminDashboard/RevenueChart.tsx), [ChallengeChart](components/adminDashboard/ChallengeChart.tsx), [DailyUsersChart](components/adminDashboard/DailyUsersChart.tsx), [SubscribersChart](components/adminDashboard/SubscribersChart.tsx), [TopCountriesChart](components/adminDashboard/TopCountriesChart.tsx), [userPieChart](components/adminDashboard/userPieChart.tsx)) — apply neon palette to recharts/chart.js datasets via theme objects; **datasets and props remain identical**
- Tables ([AdminTable](components/adminDashboard/administrators/AdminTable.tsx), [userTable](components/adminDashboard/users/userTable.tsx), [SubmissionsTable](components/adminDashboard/challenges/SubmissionsTable.tsx), [TransactionsTable](components/adminDashboard/plan&Billing/TransactionsTable.tsx)) — adopt restyled UI table primitive
- Forms ([AdministratorForm](components/adminDashboard/administrators/AdministratorForm.tsx), [EditChallengeForm](components/adminDashboard/challenges/EditChallengeForm.tsx), [PlanForm](components/adminDashboard/plan&Billing/PlanForm.tsx), [CouponForm](components/adminDashboard/plan&Billing/CouponForm.tsx)) — dark inputs/selects, **same Zod schemas, same `react-hook-form` wiring, same submit handlers**
- Cards ([PlanCard](components/adminDashboard/plan&Billing/PlanCard.tsx), [CouponCard](components/adminDashboard/plan&Billing/CouponCard.tsx), [TopicCard](components/adminDashboard/challenges/TopicCard.tsx)) — dark surface, neon hover

### 4.11 Editors — [components/Tiptap.tsx](components/Tiptap.tsx), [components/Toolbar.tsx](components/Toolbar.tsx)
- Dark editor surface, neon caret, mono code blocks (already styled — extend)
- Toolbar: ghost icon buttons with neon active state

### 4.12 Loading / empty states — [components/Loading.tsx](components/Loading.tsx)
- Replace with terminal-style spinner or animated grid pulse

---

## 5. Motion & Micro-Interactions Policy

- Reuse existing **framer-motion** (already installed). No new motion library.
- Standard transition: `{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }`
- Standard hover: `whileHover={{ y: -2 }}` + neon ring via Tailwind
- Page enter: `initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}`
- Stat counters: count-up via `useMotionValue` + `useTransform` (visual only — number source stays from Redux)
- Background grid: pure CSS animation (`grid-fade` keyframe) — no JS

---

## 6. Responsiveness

- Mobile-first reverify on every restyled page (existing `min-400` … `min-1400` breakpoints retained)
- Mobile drawer in Navbar: dark sheet, neon active row
- Admin sidebar: collapsed icon-only at `<lg`, full at `≥lg` (existing `isCollapsed` state preserved)
- Challenge grid: 1 → 2 → 3 cols across breakpoints (current behavior)
- Tables: keep horizontal scroll on small screens; sticky neon header

---

## 7. Accessibility

- All new color pairs verified against WCAG AA on dark bg (neon green on near-black ≈ 14:1)
- Focus rings: neon `--ring` (currently `216 12% 84%`) → `#9FEF00`
- Maintain existing Radix a11y semantics in tabs, dropdowns, dialogs
- Reduce-motion respected: wrap decorative animations in `@media (prefers-reduced-motion: no-preference)`

---

## 8. Execution Phases

Suggested order (each phase is independently shippable, nothing breaks logic):

1. **Foundation** — tokens, globals, primitive UI components (§3)
2. **Global chrome** — layout + navbar + footer (§4.1)
3. **Public/home flow** — challenges hub + cards + detail/IDE (§4.2–4.4)
4. **Billing flow** — pricing + checkout (§4.5)
5. **User area** — profile, submissions, notifications (§4.6–4.8)
6. **Auth** — sign-in / sign-up (§4.9)
7. **Admin dashboard** — sidebar/nav, charts, tables, forms (§4.10)
8. **Editors & loading polish** (§4.11–4.12)
9. **QA pass** — every route at three breakpoints, every interactive flow click-tested

---

## 9. Verification Checklist (per phase)

Before marking a phase done:

- [ ] `npm run build` passes
- [ ] `npm run lint` shows no new warnings
- [ ] Affected routes load without console errors
- [ ] Affected forms submit successfully (smoke-test, no schema/handler change)
- [ ] Redux state shape unchanged (`@reduxjs/toolkit` slices unedited)
- [ ] Clerk auth flows unchanged (sign-in, sign-up, sign-out, profile)
- [ ] Payment auto-submit hidden form still triggers (visual check on subscribe)
- [ ] Monaco / Tiptap still functional
- [ ] Mobile (375px), tablet (768px), desktop (1440px) layouts verified

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Recharts/Chart.js color overrides breaking tooltips | Override via `options.plugins`/dataset colors only — never touch data |
| Clerk `appearance` prop misalignment | Use Clerk's documented `elements` keys; do not wrap or replace `<UserButton/>` |
| Monaco theme fighting with Tailwind dark | Pass Monaco `theme: 'vs-dark'` or custom theme via existing prop API |
| Split.js `.gutter` re-style breaking drag | Keep dimensions identical, only recolor |
| Tailwind purge missing dynamic class strings | Avoid runtime-built class names; use `cva` variants in primitive components |
| Unintended cascade from globals | Scope new utilities under explicit class names; don't restyle bare elements globally |

---

## 11. Out of Scope (explicit non-goals)

- New routes, new pages, new features
- Backend changes, schema changes, API contract changes
- Replacing Clerk, Redux, Tailwind, or any installed dependency
- Adding light-mode toggle UI (dark is the new default; light variables left intact for future)
- Copy/content rewrites (only typographic restyle)
- SEO/metadata overhaul

---

**Awaiting your review.** Once approved, I'll start with Phase 1 (Foundation) and check in after each phase before moving on.
