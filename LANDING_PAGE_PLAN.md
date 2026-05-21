# Landing Page Plan — Violethat

> **Project:** New marketing landing page for Violethat (HTB-inspired premium SaaS)
> **Constraint:** Same "no business logic changes" rule as the redesign — but here we ARE building a new page from scratch under a new route (`/` will be replaced by the new landing; the existing Challenges list moves to a logged-in surface)
> **Stack:** Next.js 15 App Router · React 19 · Tailwind 3 · Framer Motion · Clerk · existing dark/purple design system from REDESIGN_PLAN
> **Goals:** Premium SaaS look · SEO + AEO + GEO citable · Lighthouse 95+ across the board · clear to browsers and AI crawlers · communicates the product in <3 seconds

---

## 1. Context & Strategic Direction

### What we learned from the legacy site (violethat.com)

The current live site positions Violethat as a **paid membership for detection engineers** with a single product called **Detect-DB** — a research repository. Tagline: *"Know Your Defense"*. Headline: *"The Playground for Detection Engineers"*. Founder: Kartik Durg. DPIIT-recognized startup. Goa HQ. No pricing, no testimonials, no logos, no metrics, no public sub-pages.

**The new product is a major evolution:** a hands-on CTF coding platform with an in-browser Monaco IDE (C/C++), a remote agent runner that streams live execution logs, flag capture, plans (Monthly/Yearly/Per Challenge), Clerk auth, and an admin dashboard. The landing page must bridge the legacy "playground for detection engineers" identity into the new "compile, run, capture the flag in the browser" experience.

### Copy / brand assets to preserve

- **"Know Your Defense"** — strong, ownable tagline. Evolve to **"Know Your Defense. Train Your Offense."** to cover both red and blue audiences.
- **"The Playground for ___ Engineers"** — keep the playground frame; expand audience.
- **Detect-DB** — keep as the named challenge library sub-brand.
- **DPIIT recognition** — government trust signal, real and rare; surface it.
- **Founder bio** — credible engineer founder; reuse on /about.
- **Logo + Vio_ethat** stylization — terminal underscore matches the new dark theme perfectly.

### What we are NOT carrying over

- The "membership platform for detection engineers" positioning (too narrow for the new product).
- The light, marketing-pamphlet visual style.
- The pricing opacity (we will publish all tiers).

### Target audience

1. **Endpoint Detection engineers, blue teamers, SOC analysts** (legacy audience, expanded)
2. **Malware analysts, security researchers, Students in security tracks**
3. **Team leads / hiring managers / CISOs** evaluating training platforms for their teams (secondary B2B lane)

### Competitor positioning (pick a fight)

We compete with Hack The Box, TryHackMe, OffSec PWK labs, RangeForce, PortSwigger Academy. Our wedge:

- **In-browser IDE + flag system** — not just labs, a real code-write-compile-run-capture loop
- **Live agent runner with streaming logs** — see your code execute and your flags drop in real time
- **C/C++ malware-friendly stack** — appeals to the detection/research crowd legacy already attracts
- **Indian-founded, global product** — DPIIT cred + global ambition

---

## 2. Information Architecture

Final order of sections (top → bottom). Each section justifies its place by doing one conversion job.

| # | Section | Conversion job | Approx height |
|---|---|---|---|
| 1 | Sticky Nav | Persistent CTA + navigation | 64px |
| 2 | Hero (split terminal) | 3-second pitch + 2 CTAs | 88vh |
| 3 | "Trusted by" strip | Instant credibility | 120px |
| 4 | Live IDE + Agent Demo | Show, don't tell — main proof | 110vh |
| 5 | Three Pillars triptych | Scannable product summary | 600px |
| 6 | Feature: Challenges & Tracks | Depth for evaluators | 720px |
| 7 | Feature: Agent Runner & Live Logs | Differentiation moat | 720px |
| 8 | Feature: Progression / Leaderboard | Gamification credibility | 600px |
| 9 | Stats Band | Scale proof | 240px |
| 10 | Comparison Table (vs HTB / THM) | AEO + objection handling | 520px |
| 11 | For Teams / Enterprise band | B2B lane | 480px |
| 12 | Testimonials | Humanize social proof | 560px |
| 13 | Pricing | Remove "how much?" friction | 720px |
| 14 | FAQ | Final objections + AEO/GEO | 480px |
| 15 | Final CTA band | Capture deep scrollers | 360px |
| 16 | Footer | Nav, trust, compliance | 480px |

---

## 3. Section-by-Section Specification

### 3.1 Sticky Nav

**Layout:** logo left · nav links centered · auth/user actions right.

- **Left:** logo (Vio_ethat with terminal underscore — clickable, returns to `/`)
- **Center:** `Platform · Challenges · Pricing · Docs`
- **Right (conditional on auth state):**
  - **Unauthenticated:** `Sign In` (ghost) + `Sign Up` (purple filled)
  - **Authenticated regular user:** `Profile` (ghost) + Clerk `<UserButton/>` avatar
  - **Authenticated admin (role === 'admin'):** `Profile` + `Dashboard` (purple filled, links to `/admin`) + Clerk `<UserButton/>` avatar

**Style:**
- Backdrop blur 12px over `rgba(10,10,15,0.7)`, sticky top
- Single 1px purple scan-line on top edge that runs once on mount, then stops
- Mono uppercase nav items with neon purple underline on active route (reuse `motion.div layoutId="navIndicator"` pattern from existing Navbar)
- Mobile: collapse center links into hamburger drawer; right-side auth actions stay visible (avatar only on mobile)

**Implementation notes:**
- Build as a new `<MarketingNav/>` in `components/landing/` — does NOT replace the existing app Navbar
- Reuse the auth-state detection logic from [components/shared/Navbar.tsx](components/shared/Navbar.tsx): `useAuth()`, `useUser()`, `useCheckRole()`, `useAdminAccess()`, `getCurrentUserId()` — copy the hook setup verbatim so behavior matches the rest of the app
- Conditionally render `<MarketingNav/>` only on the landing + other `(marketing)` routes via the `(marketing)/layout.tsx`; the app routes keep using the existing Navbar
- Profile link: `/profile?id=${currentUserId}` (same pattern as existing Navbar)
- Dashboard link: respects `isPrivilegedAdmin` → `/admin` vs `/admin/challenges` (same as existing Navbar)

### 3.2 Hero — Split Terminal (Pattern A)
- Left 55%: terminal eyebrow `> root@violethat:~$`, display headline **"Know Your Defense. Train Your Offense."** (or v2: **"Compile. Run. Capture the flag — right in your browser."**), 18px subhead (≤22 words: *"A hands-on playground for detection engineers, blue teamers, and security researchers — write C/C++, run the agent, capture flags in seconds."*), two CTAs: `Start Free` (purple filled) + `Watch 90-sec demo` (ghost with play icon), micro-row of trust badges (DPIIT Recognized · Browser-native IDE · Real flag capture)
- Right 45%: live-looking terminal card with a 4-line scripted prompt (e.g., compile + run + flag-captured toast), blinking caret, single purple glow behind it
- Static SVG / CSS for the terminal — no JS-driven typing loop
- Hero is the **LCP** — must be text-only, font-preloaded, no above-fold blocking images

### 3.3 "Trusted by" strip
- Full-width band with eyebrow `// trusted by security teams at`
- 7-9 grayscale logos at 32px height OR, if we don't have logos yet: a metric row (`4.8 G2 · DPIIT Recognized · SOC 2 in progress · Featured at DefCamp`)
- **Static, no carousel**

### 3.4 Live IDE + Agent Demo — the hero proof
- Full-bleed dark panel with a faux Monaco IDE (we already have the real one — pull a screenshot or screen-record)
- Left rail (challenge description / tabs), center Monaco editor pane (C/C++), right pane (live agent log stream with status pill)
- Scripted CSS-keyframe demo: user clicks Compile → "Compiled successfully" → clicks Run → log lines stream in (hooking, decoded payload, …) → "Flag captured" toast
- Triggered by IntersectionObserver, pauses when off-screen, respects `prefers-reduced-motion`
- H2: **"Capture your first flag in 60 seconds."** Subhead: *"No setup. No VM. No install. Write C/C++ in the browser, run the agent, watch the logs."*
- CTA below: `Try a challenge →` (anchors to signup / challenges page)

### 3.5 Three Pillars triptych
- 3 equal columns with 48px line-icons (`Terminal`, `Cpu`, `ShieldAlert`)
- Headlines (rebalanced for the detection-engineer-first audience):
  1. **"Real adversary techniques. Real detection logic."**
  2. **"In-browser IDE. Zero setup."**
  3. **"Live agent runner. Real-time logs."**
- 2-line description + text link per column
- Background: base color, no glow

### 3.6 Feature deep-dive #1 — Challenges & Tracks
- Left text (60%) / right visual (40%) split
- Visual: mock challenge card grid, 6 cards with difficulty pills (Easy/Medium/Hard/Insane), category tags (Web · Pwn · Crypto · AD · Detection), points, and tiny user-avatar stack ("847 solved")
- One featured card has the purple-fuchsia glow border (reuse the premium ChallengeCard styling from the latest commit)
- Copy ≤80 words. Lead with the outcome: *"From script-kiddie to OSCP-ready in 12 weeks."*

### 3.7 Feature deep-dive #2 — Agent Runner & Live Logs
- Reverse split (visual left, text right)
- Visual: terminal-style log pane that streams real-looking agent output ("HOOK SUCCESS: CreateFileW intercepted", "[+] payload decoded", "[+] flag candidate: VHCTF{...}") with a status pill that flips `Agent Idle` → `Agent Live` (purple glow-pulse)
- Subtle purple typing cursor; loop max 3 times then freeze on the final frame
- Label `Interactive demo`
- Copy: emphasize *"see every keystroke and every syscall as your code runs against the target"*

### 3.8 Feature deep-dive #3 — Progression / Leaderboard
- Center-aligned
- Stylized rank-up ladder (Noob → Script Kiddie → Hacker → Pro Hacker → Elite → Guru → Omniscient — HTB-validated mental model)
- Right side: a "live" leaderboard pane with 5 usernames + flag counts (mock data)

### 3.9 Stats band
- Full-width dark band, 4 huge mono numerals (`850+ challenges`, `120K+ operators`, `4.2M flags captured`, `99.99% platform uptime`)
- Numerals in `#A855F7` (purple) and rendered with `<StatCounter/>` (Phase 1 helper)
- **Count up once on first view, then static**
- Replace mock numbers with real ones before launch — fake metrics destroy AEO trust scores

### 3.10 Comparison table (vs HTB / TryHackMe)
- Real `<table>` with `<th scope="col">` headers
- Columns: Violethat · HackTheBox · TryHackMe
- Rows: Price · Challenge count · Beginner-friendly · In-browser IDE · Live agent runner · C/C++ malware labs · Detection-engineer focus · Cert prep · Team plans
- **AEO/GEO gold** — Perplexity and ChatGPT cite these heavily
- Must be factually accurate; competitors will read it

### 3.11 For Teams / Enterprise band
- Split layout. Left: H2 *"Build the cyber workforce your CISO actually trusts."* + 3 checkmarked bullets (SSO/SCIM, custom labs, compliance reporting) + `Talk to Sales` CTA
- Right: small logo grid of enterprise customers + SOC 2 / ISO 27001 badge row (only ship real badges)

### 3.12 Testimonials
- 3 cards in a row, each: avatar 48px, name, role + company, 2-line quote, optional small company logo
- Mix: 1 CTF player, 1 CISO, 1 bootcamp instructor (or 3 detection engineers if those are the real customers we have)
- **Static grid, no carousel**

### 3.13 Pricing
- 3 tiers: `Free / Pro (most popular) / Teams`
- Middle tier gets the premium card styling we just shipped (gradient surface, fuchsia accents, Crown icon)
- Each card: huge mono price, 1-line value statement, 6-8 feature bullets with check icons, CTA button
- Monthly/Annual toggle with "Save 20%" pill
- Below: `Compare all features →` link
- Pull live plan data from existing `/redux/features/planSlice` so prices stay in sync with admin

### 3.14 FAQ
- Reuse [components/billing/FAQ.tsx](components/billing/FAQ.tsx) pattern (dark accordion, neon plus/minus)
- 6-8 questions ordered by objection severity:
  1. What is Violethat?
  2. Is it legal? (isolated execution environment explanation)
  3. Do I need to install anything?
  4. Will this prep me for OSCP / CPTS?
  5. How is this different from HackTheBox / TryHackMe?
  6. Can my company expense it?
  7. Can I cancel anytime?
  8. What languages / frameworks are supported?
- Mirror visible content in FAQPage JSON-LD verbatim
- Each H2 = literal user question (AEO requirement)

### 3.15 Final CTA band
- Full-width purple radial glow, centered
- H2: **"Boot up your first box."**
- Subtext one line
- Two CTAs: `Create free account` (purple filled) + `Book a team demo` (ghost)
- Background: faint repeating mono ASCII pattern at 4% opacity

### 3.16 Footer
- 5 columns: Platform / Learn / Company / Legal / Connect
- Bottom row: small logo, copyright, SOC 2 / GDPR badges, status page link with green dot, language switcher
- Single mono personality line: `$ violethat --version 2.4.1`

---

## 4. Visual System (reuses existing design tokens)

Everything inherits from REDESIGN_PLAN Phase 1:

- **Color**: dark base (`#0B0F17`), panel (`#111927`), purple primary (`#A855F7`), fuchsia accent (`#D946EF` from Tailwind), white text on purple buttons
- **Typography**: Geist sans body + JetBrains Mono for code/eyebrows/numerals
- **Components to reuse**: `<GridBackground/>`, `<NeonDivider/>`, `<TerminalEyebrow/>`, `<StatCounter/>`, `<SectionShell/>`, `Card`, `Button` (variants `neon` / `ghost-neon` / `outline-dim` / `violet`), `Badge`
- **New components to create**:
  - `<MarketingNav/>` — landing-only nav (different from app Navbar)
  - `<HeroTerminal/>` — the scripted right-side terminal mockup
  - `<IdeAgentDemo/>` — the section-4 scripted IDE + agent animation
  - `<AgentLogStream/>` — the section-7 streaming-log loop
  - `<ChallengePreviewGrid/>` — the section-6 mock card grid
  - `<RankLadder/>` — section-8
  - `<ComparisonTable/>` — section-10
  - `<MarketingFooter/>` — landing-only footer

### Cross-cutting design rules

- Max content width 1280px, outer 1440px
- Section side padding 96px desktop / 24px mobile
- Every section 96-160px top/bottom padding
- Alternate `bg-htb-bg` and `bg-htb-bg-deep` between sections for cadence
- Type scale: Display 64/72 (hero), H2 44/52, H3 24/32, body 16/26, mono 14/22
- Max **one** purple radial-gradient blob per viewport
- Eyebrow pattern: every H2 has a mono eyebrow `// section_name`

### Micro-interactions (perf-safe)

- Terminal caret blink (pure CSS keyframe)
- Stats count-up once on viewport entry, then freeze
- Hover-lift on cards: `translateY(-2px)` + box-shadow purple glow
- Scan-line sweep on nav mount, runs once
- Section reveal: 8px translateY + opacity fade-in, 400ms, once (IntersectionObserver)
- Respect `prefers-reduced-motion`

### What NOT to do

- No hoodie-hacker stock photos
- No Matrix green-rain (cringe + we're purple anyway)
- No autoplay video hero with sound
- No carousels (logos, testimonials)
- No "Get Started" — always specific (`Start Free`, `Capture your first flag`, `Try a challenge`)
- No light-mode toggle at launch
- No pricing behind "Contact us" for individual tier
- No more than 1 primary CTA color on screen
- No animated cursor trails / particle backgrounds

---

## 5. SEO / AEO / GEO Implementation

### 5.1 Metadata (Next.js 15 App Router)

In `app/layout.tsx`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://violethat.com'),
  title: {
    default: 'Violethat — Hands-on Offensive Security Labs',
    template: '%s | Violethat',
  },
  description: 'A hands-on playground for offensive engineers, blue teamers, and security researchers. Compile, exploit, capture the flag in your browser.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Violethat', locale: 'en_US', ... },
  twitter: { card: 'summary_large_image', site: '@violethat' },
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}
```

In `app/opengraph-image.tsx` + `app/twitter-image.tsx` — generate 1200×630 PNG via `ImageResponse` from `next/og` with the Violethat brand on dark background.

In `app/icon.tsx` + `app/apple-icon.tsx` — generate favicons from `/public/VioletHat Logo_Emblen_Violet.svg`.

### 5.2 JSON-LD structured data (single `@graph`)

Render in the landing page Server Component:

- **Organization** — name, url, logo, sameAs (Twitter, GitHub, LinkedIn), contactPoint
- **WebSite** with SearchAction
- **SoftwareApplication** — `applicationCategory: 'SecurityApplication'`, `operatingSystem: 'Web'`, `offers` mirrored from pricing
- **Product + Offer** for each pricing tier
- **FAQPage** — mirror visible FAQ verbatim
- **BreadcrumbList**
- **Course** (one per challenge track) — `provider`, `educationalLevel`, `teaches`

### 5.3 robots.txt + sitemap.xml + llms.txt

- `app/robots.ts` — allow `/`, disallow `/api/`, `/admin/`, `/dashboard/`, point sitemap
- `app/sitemap.ts` — home + `/pricing` + `/labs` + `/vs/*` comparison pages + blog
- `/public/llms.txt` — brand summary, key URLs, contact, license

### 5.4 AEO (ChatGPT / Perplexity / Claude)

- Definition sentence in first 100 words: *"Violethat is a hands-on cybersecurity training platform that lets you write C/C++ in the browser, run a live agent against the target, and capture flags in real time."*
- Every FAQ H2 is the literal user question; answer is the first `<p>` directly below
- Use `<dl><dt><dd>` for glossary terms (e.g., what is a CTF, what is a flag, what is an agent runner)
- Numbered `<ol>` for procedures (e.g., "How to capture your first flag in 5 steps")
- Comparison `<table>` rendered server-side with `<th scope="col">`
- Visible author byline + dates on any blog posts
- Outbound links to MITRE ATT&CK / NIST / CVE where relevant
- Real testimonials with full name, company, photo

### 5.5 GEO (Google AI Overviews)

- Patterns to include: direct-answer paragraphs, `HowTo` schema for tutorials, statistics with citations, numbered step lists (3-7 steps), comparison tables, "best X for Y" framing
- `Article` schema with `author`, `publisher`, `datePublished`, `dateModified` on any content pages
- Build comparison pages: `/vs/hackthebox`, `/vs/tryhackme`, `/vs/portswigger-academy`
- Brand mention strategy: get cited on r/netsec, r/AskNetsec, Hacker News, GitHub awesome-lists, dev.to, security YouTube

### 5.6 Comparison pages (separate route, post-launch v1.5)

- `/vs/hackthebox` — full feature comparison, honest, with deep links
- `/vs/tryhackme`
- These pages are SEO gold and AI-citation magnets

---

## 6. Lighthouse / Core Web Vitals — concrete rules

### 6.1 LCP < 2.5s

- LCP element = hero headline (text)
- Preload primary font: `next/font` with `display: 'swap'`, `preload: true`, `subsets: ['latin']`
- If hero ships with a background image: `priority`, `fetchPriority="high"`, explicit dimensions, AVIF
- No JS-gated hero render

### 6.2 INP < 200ms

- Use CSS `:hover` over JS handlers wherever possible
- `useDeferredValue` / `startTransition` for hover-driven UI
- `passive: true` on scroll listeners
- Debounce expensive handlers
- Animated counters use IntersectionObserver, not scroll listener

### 6.3 CLS < 0.1

- Reserve space for every image and iframe via `aspect-ratio` or explicit width/height
- `adjustFontFallback` on `next/font` (default on) eliminates font-swap CLS
- Cookie banner uses fixed positioning
- Testimonial cards have fixed heights — no late-loading layout shift

### 6.4 Bundle / JS

- Initial JS for `/` ≤ 170 KB gzipped
- Page, layout, hero text, copy, FAQ, footer = Server Components (zero JS)
- `'use client'` only on interactive leaves: nav menu, hero terminal, IDE+agent demo, agent log stream, count-up stats, pricing toggle, FAQ accordion
- `next/dynamic({ ssr: false })` for below-fold heavy components (IDE+agent demo, agent log stream if heavy)

### 6.5 Animations

- Safe: `transform`, `opacity`, CSS `will-change` used sparingly
- Avoid: animating `width`/`height`/`top`/`left`, `box-shadow` keyframes, `filter: blur()` on large surfaces, `backdrop-filter` over full viewport
- Grid background: static SVG / CSS, no JS scroll-linked animation
- Hero glow: static radial gradient

### 6.6 Third-party scripts

- Clerk: do NOT mount `<ClerkProvider>` at the marketing layout level — wrap only routes that need auth
- Analytics: `next/script` with `strategy="afterInteractive"`
- Chat widgets / pixels: `strategy="lazyOnload"`
- No inline analytics in `<head>`

### 6.7 Images

- `next.config.ts` → `images.formats: ['image/avif', 'image/webp']`
- All `<img>` replaced with `<Image>` from `next/image`
- Decorative images: `alt=""` + `aria-hidden="true"`
- Informative images: descriptive alt, never start with "Image of"

---

## 7. Accessibility & Browser Clarity

- Exactly **one `<h1>`** per page (the hero headline)
- Landmarks: `<header><nav aria-label="Primary"><main id="main"><footer>`
- Skip link as first focusable element: `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>`
- Visible `:focus-visible` ring on every interactive element (purple 2px outline)
- WCAG AA contrast verified on dark theme (purple-on-black hits ~7:1 for body)
- Heading hierarchy: H1 → H2 → H3, no skipped levels
- `prefers-reduced-motion: reduce` disables all decorative animation
- Color is never the only signal (icons + text labels everywhere)

---

## 8. Routing & File Structure

```
app/
├── layout.tsx               # adjust: NOT wrapping marketing routes with ClerkProvider
├── page.tsx                 # NEW LANDING — replaces current "Challenges" import
├── opengraph-image.tsx      # NEW
├── twitter-image.tsx        # NEW
├── icon.tsx                 # NEW
├── apple-icon.tsx           # NEW
├── robots.ts                # NEW
├── sitemap.ts               # NEW
├── (marketing)/             # NEW route group — landing + comparison + about
│   ├── layout.tsx           # lighter shell, no Clerk, no Redux
│   ├── about/page.tsx
│   ├── vs/
│   │   ├── hackthebox/page.tsx
│   │   └── tryhackme/page.tsx
│   └── pricing/page.tsx     # public pricing (separate from billing)
├── (root)/                  # existing app routes — challenges hub moves here
│   ├── layout.tsx           # existing, now wraps the app's authenticated surfaces
│   └── challenges/page.tsx  # NEW — move current Challenges component here
└── ...

public/
└── llms.txt                 # NEW

components/
└── landing/                 # NEW folder for all landing-only components
    ├── MarketingNav.tsx
    ├── HeroSplitTerminal.tsx
    ├── HeroTerminal.tsx
    ├── TrustStrip.tsx
    ├── IdeAgentDemo.tsx
    ├── ThreePillars.tsx
    ├── FeatureChallenges.tsx
    ├── FeatureAgentRunner.tsx
    ├── AgentLogStream.tsx
    ├── FeatureProgression.tsx
    ├── RankLadder.tsx
    ├── StatsBand.tsx
    ├── ComparisonTable.tsx
    ├── ForTeamsBand.tsx
    ├── TestimonialsGrid.tsx
    ├── PricingSection.tsx
    ├── LandingFAQ.tsx
    ├── FinalCTA.tsx
    ├── MarketingFooter.tsx
    └── jsonld/
        ├── Organization.tsx
        ├── WebSite.tsx
        ├── SoftwareApplication.tsx
        └── FAQPage.tsx
```

**Important route migration:** the current `app/page.tsx` shows the logged-in Challenges list. We need to:
1. Move `<Challenges/>` to `app/(root)/challenges/page.tsx`
2. Update the global Navbar's "Challenges" link from `/` to `/challenges`
3. Replace `app/page.tsx` with the new landing page
4. Logged-in users on `/` see the landing (with a personalized CTA) OR get auto-redirected to `/challenges` — decision needed before build

---

## 9. Execution Phases

Recommended order (each phase independently shippable, no logic breakage):

### Phase L1 — Routing & metadata foundation
- Move `<Challenges/>` to `/challenges`
- Update Navbar links
- Add `app/opengraph-image.tsx`, `twitter-image.tsx`, `icon.tsx`, `apple-icon.tsx`
- Add `app/robots.ts`, `app/sitemap.ts`
- Add `/public/llms.txt`
- Update root `metadata`
- Verify Clerk doesn't bleed into marketing routes

### Phase L2 — Hero + Nav + Footer
- Build `<MarketingNav/>`, `<HeroSplitTerminal/>`, `<HeroTerminal/>`, `<MarketingFooter/>`
- Replace `app/page.tsx` with new landing skeleton showing just these three
- Ship: page is live with clean hero + nav + footer, even before other sections land

### Phase L3 — Proof sections
- `<TrustStrip/>`, `<IdeAgentDemo/>`, `<ThreePillars/>`

### Phase L4 — Deep-dive features
- `<FeatureChallenges/>`, `<FeatureAgentRunner/>` + `<AgentLogStream/>`, `<FeatureProgression/>` + `<RankLadder/>`

### Phase L5 — Conversion sections
- `<StatsBand/>`, `<ComparisonTable/>`, `<ForTeamsBand/>`, `<TestimonialsGrid/>`

### Phase L6 — Pricing + FAQ + Final CTA
- `<PricingSection/>` (wire to existing planSlice), `<LandingFAQ/>` (mirror FAQPage JSON-LD), `<FinalCTA/>`

### Phase L7 — JSON-LD + SEO polish
- Inject Organization, WebSite, SoftwareApplication, FAQPage JSON-LD
- Validate at Google Rich Results Test
- Run Lighthouse, fix any LCP/INP/CLS regressions

### Phase L8 — Comparison pages + QA
- `/vs/hackthebox`, `/vs/tryhackme`
- `/about` page (preserve founder bio from legacy)
- Full QA at 375 / 768 / 1440 breakpoints

---

## 10. Pre-launch Checklist (40 items)

### SEO
- [ ] `metadataBase` set in root layout to production URL
- [ ] Per-route `title` ≤60 chars, `description` 140-160 chars
- [ ] `alternates.canonical` set on every page
- [ ] `app/opengraph-image.tsx` + `app/twitter-image.tsx` render at 1200×630
- [ ] `app/icon.tsx` + `app/apple-icon.tsx` present
- [ ] `robots` allow indexing, `googleBot.max-image-preview: large`
- [ ] `app/robots.ts` allows `/`, disallows `/api/`, `/admin/`, references sitemap
- [ ] `app/sitemap.ts` includes all public routes with `lastModified`
- [ ] `/public/llms.txt` shipped
- [ ] JSON-LD `@graph` validated in Rich Results Test
- [ ] Comparison pages live
- [ ] URLs lowercase, hyphenated, no trailing slash

### AEO / GEO
- [ ] Every FAQ H2 is a literal user question; answer in first `<p>` below
- [ ] Definition sentence in first 100 words
- [ ] Comparison `<table>` with `<th scope="col">` rendered server-side
- [ ] Numbered `<ol>` for any "how to" content
- [ ] Visible author byline + dates on content pages
- [ ] Outbound links to MITRE ATT&CK / NIST / CVE where relevant
- [ ] Real testimonials with name, company, photo
- [ ] `/about` page with team and credentials
- [ ] `Person` schema for authors

### Performance
- [ ] Hero image: `priority`, `fetchPriority="high"`, explicit dimensions, AVIF
- [ ] `next.config.ts` enables AVIF + WebP
- [ ] `next/font` with `display: 'swap'`, `preload: true`, ≤2 families
- [ ] No CSS-in-JS runtime
- [ ] Initial route JS ≤170 KB gzipped (verify via `next build` output)
- [ ] Below-fold heavy components wrapped in `next/dynamic`
- [ ] `'use client'` only on leaf components
- [ ] Animations use `transform`/`opacity` only
- [ ] `prefers-reduced-motion` honored
- [ ] Analytics loaded via `next/script` `afterInteractive`
- [ ] Clerk excluded from marketing layout
- [ ] `<link rel="preconnect">` to CDN
- [ ] Cookie banner fixed-positioned
- [ ] All images / iframes have explicit dimensions

### Accessibility / Clarity
- [ ] Exactly one `<h1>`; no skipped heading levels
- [ ] Landmarks: `<header><nav><main><footer>`; `<main id="main">`
- [ ] Skip-to-content link first focusable element
- [ ] WCAG AA contrast verified with axe
- [ ] Visible `:focus-visible` ring on all interactive elements

### Verification
- [ ] `npm run build` shows no errors
- [ ] Lighthouse mobile (throttled): Performance ≥95, Accessibility 100, Best Practices 100, SEO 100
- [ ] PageSpeed Insights field + lab both green
- [ ] Rich Results Test passes for SoftwareApplication, FAQPage, Organization
- [ ] axe DevTools clean
- [ ] `/sitemap.xml` and `/robots.txt` resolve on staging
- [ ] OG image preview verified via opengraph.xyz

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Moving Challenges from `/` to `/challenges` breaks existing Navbar links and bookmarks | Audit all `href="/"` → keep landing at `/`, update only the Navbar item that says "Challenges" to point to `/challenges`. Add a 301 redirect from any legacy URLs if needed. |
| Logged-in users land on marketing page instead of their dashboard | Add a small banner / personalized CTA when `userId` present, OR auto-redirect to `/challenges`. Decision needed before Phase L2. |
| IDE + agent demo animation hurts LCP | Lazy-mount via IntersectionObserver, never render above the fold. |
| Clerk bundle bleeds into marketing route | Restructure layout: marketing route group `(marketing)` has its own layout WITHOUT `ClerkProvider`. App routes `(root)`, `/admin`, `/profile`, `/sign-in`, `/sign-up` keep it. |
| Fake stats / mock testimonials get cited by AI | Replace with real numbers / real customers before launch. Until then, use ranges ("Hundreds of operators training daily") not fabricated specifics. |
| Pricing page diverges from admin-managed plans | Wire `<PricingSection/>` to `planSlice` so prices auto-sync with whatever admin has configured |
| Comparison pages get factually wrong about HTB / THM | Have a security engineer fact-check before publish; date the comparison ("Updated November 2026") so it self-justifies any drift |

---

## 12. Out of scope (explicit non-goals)

- Blog / CMS (separate project)
- Authenticated dashboard redesign (already done in REDESIGN_PLAN)
- Internationalization / i18n
- A/B testing infrastructure
- Customer-facing changelog
- Pricing experiments / Stripe migration
- Email capture / waitlist
- Light-mode toggle

---

**Awaiting your review.** Once approved, I'll start with Phase L1 (routing + metadata foundation) — that's the safest, smallest-blast-radius work — and check in after each phase before moving on.
