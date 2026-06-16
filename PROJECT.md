# Links Valuers & Assessors — Full Project Documentation

> A complete reference for the Links Valuers website: what's been built, how it's
> structured, where content lives, and what's still outstanding. Written so this
> can be handed to anyone — a new developer, a marketing hire, or Cephas himself
> — and they can pick up exactly where things stand without re-deriving context.

**Client:** Links Valuers & Assessors Ltd
**Tagline:** *Confidence Before Every Vehicle Decision™*
**Industry:** Vehicle valuation & assessment (insurance, bank collateral, fleet, court reports, pre-purchase, accident assessment) — Kenya
**Repo:** `gathiicephas-ux/linksvaluers` on GitHub
**Live (GitHub Pages):** https://gathiicephas-ux.github.io/linksvaluers/
**Intended production domain:** `www.linksvaluers.com` (see [Known Issues](#known-issues--pending-items) — not yet pointed at GitHub Pages)

---

## 1. Tech Stack & Hosting

This is a **fully static site** — plain HTML, CSS, and vanilla JavaScript. No
build step, no framework, no package manager, no server-side code.

| Layer | Choice |
|---|---|
| Markup | Hand-written HTML, one file per page |
| Styles | A single `css/styles.css` design-system file (CSS custom properties) |
| Behaviour | A single `js/main.js` (IIFE-scoped vanilla JS, no libraries) |
| Fonts | Google Fonts — **Barlow Condensed** (display/headings) + **Inter** (body) |
| Hosting | **GitHub Pages**, serving directly from the `main` branch root |
| Forms / email | **FormSubmit.co** (no-signup, no-backend form-to-email forwarding) |
| Maps | Keyless Google Maps `iframe` embed |
| Chat widget | Custom rule-based JS chatbot (no AI API, no backend) — see [`CHATBOT.md`](CHATBOT.md) |

**Why static + FormSubmit?** There's no server to run a real backend, database,
or AI API call from. Every "dynamic" feature on this site (forms, the chatbot's
lead capture) is solved by posting to a third-party service from the browser
instead of standing up infrastructure — keeping hosting free and maintenance
near zero.

### Running locally
```bash
python -m http.server 5500
```
Then open `http://localhost:5500`.

### Deploying
Push to `main` — GitHub Pages rebuilds automatically (usually live within a
minute). There is no separate build/deploy step.

---

## 2. Site Map

| File | URL path | Purpose |
|---|---|---|
| `index.html` | `/` | Home — hero, trust strip, stats, AI-image promo slider, services, process timeline, why-Links comparison, testimonial, client pills, blog teaser slider, closing CTA |
| `about.html` | `/about` | Story, mission/vision, values, dual-licensing, leadership grid (6), team gallery slider, awards |
| `services.html` | `/services` | 6 service detail sections with deep-link anchors (`#insurance-valuation`, `#bank-valuation`, `#fleet-valuation`, `#court-reports`, `#accident-assessment`, `#pre-purchase-inspection`) |
| `branches.html` | `/branches` | Map embed, branch directory, mobile assessor info |
| `clients.html` | `/clients` | Full exhaustive partner list — 68 institutions across 4 categories |
| `faqs.html` | `/faqs` | Category-tabbed accordion (General / Insurance / Bank / Fleet / Pre-Purchase) + FAQPage schema + avatar callout |
| `blog.html` | `/blog` | 5 full-length articles (anchor-linked single page) + article index |
| `contact.html` | `/contact` | Contact details, working contact form, Westlands map, LocalBusiness schema, avatar callout |
| `book-valuation.html` | `/book-valuation` | Booking form (accepts `?type=` prefill from service CTAs across the site) |

All 9 pages share the same header/nav, mobile menu, footer, WhatsApp float
button, and chatbot widget.

---

## 3. Design System

Defined in `css/styles.css` (`:root` block) and used consistently across every
component:

| Token | Value | Use |
|---|---|---|
| `--dark` | `#0F1A10` | Primary dark background / text-on-light |
| `--green` | `#3CAA5A` | Primary brand accent (CTAs, links, highlights) |
| `--orange` | `#E8761A` | Secondary accent (badges, dots) |
| `--off-white` | `#F8F8F6` | Light section backgrounds |
| `--grey` / `--grey-light` | `#888888` / `#cfd6d0` | Body copy on light/dark |
| `--radius-card` / `--radius-btn` | `8px` / `4px` | Corner rounding |
| `--shadow-card` / `--shadow-lift` | subtle / pronounced | Resting vs. hover elevation |
| Display font | Barlow Condensed 700/800, uppercase | All headings |
| Body font | Inter 400–700 | Body copy, UI |

### Reusable components
- **Buttons** — `.btn--primary` (green fill), `.btn--ghost` (for dark
  backgrounds), `.btn--outline-dark` (for light backgrounds), `.btn--orange`
- **Pills** — `.pill` with color-coded left borders: `--green` (banks),
  `--orange` (insurers), `--blue` (SACCOs), `--purple` (MFBs); hover lift added
- **Cards** — `.svc-card`, `.leader`, `.value-card`, `.blog-card` — all share
  the same hover-lift + shadow pattern
- **Sliders** — a single generic carousel engine (`data-slider` /
  `.tslider__*`) reused three ways:
  - Base style — team gallery slider (`about.html`)
  - `.tslider--promo` modifier — full-bleed AI-image hero slider with bold text
    overlays (`index.html`)
  - A second, independent **card-slider** engine (`data-card-slider` /
    `.blog-slider__*`) for the multi-card blog carousel, which steps by one
    card width instead of one full slide
- **Chatbot widget** — fully documented separately in [`CHATBOT.md`](CHATBOT.md)
- **Reveal animations** — `.reveal` + IntersectionObserver fade/slide-in,
  applied to nearly every section
- **Animated counters** — `[data-count]` spans that count up when scrolled
  into view (used for the homepage stats)

---

## 4. Content Inventory

### Partner / client list (68 institutions, `clients.html` + curated subset on `index.html`)
| Category | Count | Pill color |
|---|---|---|
| Insurance Companies | 23 | Orange |
| Banks | 8 | Green |
| SACCOs | 10 | Blue |
| Micro-Finance Banks | 27 | Purple |

The homepage shows a curated "highlights + N more" subset per category with a
"View All 100+ Partners" link through to the full `clients.html` list.

### Leadership team (`about.html`, 6 people)
Reuben Muiruri (Director of Business Operations), Jane Kanyeki (Business
Development Manager), Stephen Kiragu (Head of Quality Control and Valuation),
Caren Chepkoech (Head of Administration), Grace Wanjiru (Customer Service
Representative), Dorcas Kanee (Head of Finance & HR).

### Blog articles (`blog.html`, 5 posts, all original content written for this site)
| # | Title | Category | Anchor slug |
|---|---|---|---|
| 1 | What To Do in the First Hour After a Breakdown or Accident | Accident Assessment | `#breakdown-accident-first-hour` |
| 2 | Why GPS-Tagged Digital Reports Are Changing Valuation in Kenya | Technology | `#gps-tagged-digital-reports` |
| 3 | Inside a Links Inspection: What We Actually Check | Quality Control | `#inside-a-links-inspection` |
| 4 | Insurance Claim Stuck? Here's How an Independent Valuation Speeds It Up | Insurance | `#speed-up-insurance-claims` |
| 5 | Buying a Used Car in Kenya? Don't Skip This One Step | Pre-Purchase | `#pre-purchase-inspection-used-car` |

### FAQ categories (`faqs.html`)
General, Insurance, Bank/Finance, Fleet, Pre-Purchase — each a tab-filtered
accordion group.

### Key brand facts referenced throughout the site
1M+ valuations completed · 99.7% first-submission acceptance · 25+ branches ·
4–48 hour turnaround · 100+ insurance & finance partners · 12+ years in
operation · Dual-licensed by **M.A.A.K** and **I.R.A**.

---

## 5. Interactive Features

| Feature | Where | How it works |
|---|---|---|
| Mobile menu | All pages | Slide-out panel, hamburger toggle |
| FAQ accordion + category tabs | `faqs.html` | Click-to-expand, tab-filtered groups |
| Animated stat counters | `index.html` | Count up on scroll-into-view |
| Scroll-reveal animations | All pages | Fade/slide-in via IntersectionObserver |
| Team gallery slider | `about.html` | Autoplay carousel, arrows, dots, swipe |
| AI-image promo slider | `index.html` | Full-bleed carousel with bold text overlays, same engine as above |
| Blog card slider | `index.html` | Multi-card carousel, steps one card at a time, arrows + swipe |
| Booking form | `book-valuation.html` | Real submission → emails `info@linksvaluers.com` via FormSubmit |
| Contact form | `contact.html` | Same FormSubmit pattern |
| Chatbot widget | All pages | Rule-based Q&A + lead capture → emails `info@linksvaluers.com`. **Full documentation in [`CHATBOT.md`](CHATBOT.md)** |
| WhatsApp deep links | All pages (floating button + form fallbacks) | Pre-filled `wa.me` links |

---

## 6. Image Asset Inventory

| Folder | Contents | Used for |
|---|---|---|
| `assets/logo.png` | Official Links logo | Header/footer brand mark, favicon |
| `images/Management/` | Original 5 leadership headshots | Superseded by sharper root-level versions (kept for reference; not linked from any page) |
| `images/` (root) | Sharper leadership headshots, team slider photos (`Full team.jpg`, `Valuations team.jpg`, `Marketing department.jpg`, `Administration Departments.jpg`), plus a set of candid `IMG-20260610-WA00xx` / `IMG-20260615-WA00xx` site photos | Leadership grid, About team slider, homepage hero |
| `images/AI Images/` | 10 stock photos, resized/compressed (originally 1.7–17MB each, now 140–370KB) and renamed descriptively (e.g. `Deal Sealed.jpg`, `Roadside Assistance.jpg`) | Homepage promo slider (5) + blog cards/articles (5) |
| `images/Avatar/` | `Links ChatBot.png` (in active use) and `Links Bot.png` (⚠️ **not used** — has "R245,000" baked into the artwork, wrong currency for KES market) | Chatbot widget, avatar callouts (FAQs, Contact, blog, homepage blog section) |
| `images/links favicon/`, `images/logo/` | Extra brand asset exports | Not currently referenced by any page — candidates for cleanup or future use |

Several candid photos (`IMG-20260615-WA0004/5/6/9/11/14/19.jpg`) are uploaded
but not yet placed anywhere — available for future slider slots or page
sections if more visual variety is wanted.

---

## 7. Third-Party Integrations

| Service | Used for | Setup needed |
|---|---|---|
| **FormSubmit.co** | Booking form, Contact form, Chatbot lead capture — all forward to `info@linksvaluers.com` | ⚠️ First-ever submission to a new address triggers a one-time "Activation Required" confirmation email FormSubmit sends to that inbox. Someone needs to click the link once; after that, all future submissions deliver automatically. |
| **Google Fonts** | Barlow Condensed, Inter | None — public CDN, already wired via `<link>` tags |
| **Google Maps (embed)** | `branches.html`, `contact.html` | Keyless `iframe` embed — works, but no API key means no custom markers/styling. Noted as a "before going live" upgrade. |
| **WhatsApp (`wa.me`)** | Floating button + form fallback links | None — just deep links to `+254 708 412 668` |
| **GitHub Pages** | Hosting | Auto-deploys on every push to `main` |

---

## 8. SEO

- Every page has a unique `<title>`, meta description, and canonical URL
  pointing at `https://www.linksvaluers.com/...`.
- `index.html` and `contact.html` carry `LocalBusiness` JSON-LD schema;
  `faqs.html` carries `FAQPage` JSON-LD schema.
- `og:title` / `og:description` / `og:type` are set on key pages for social
  link previews.
- `robots.txt` allows all crawlers and points to `sitemap.xml`.
- `sitemap.xml` lists all 9 pages, including `/blog`.

---

## 9. Known Issues / Pending Items

These are flagged so nothing gets lost — none are blockers, but worth working
through before/after a hard launch:

1. **Custom domain not yet live.** All canonical/OG tags point to
   `www.linksvaluers.com`, but the site is currently only reachable at the
   GitHub Pages URL. Point the domain's DNS at GitHub Pages (and add a
   `CNAME` file to the repo) to go live on the real domain.
2. **Privacy Policy / Terms of Service** footer links are still placeholders
   (`href="#"`) on every page — need real pages or at minimum a temporary
   policy page before public launch.
3. **Maps use a keyless embed.** Functional, but upgrading to a proper Google
   Maps Embed API key would allow custom green branded markers and per-branch
   info panels.
4. **`images/Management/`, `images/links favicon/`, `images/logo/`** contain
   assets superseded or unused by any current page — candidates for cleanup
   once confirmed unnecessary.
5. **FormSubmit activation** — confirm the one-time activation email (see
   above) has actually been clicked; otherwise leads/bookings/messages will
   silently fail to deliver.
6. **Chatbot is rule-based, not AI** — see [`CHATBOT.md`](CHATBOT.md) for full
   detail and future upgrade paths if a real AI-backed assistant is wanted
   later.

---

## 10. Change History (high-level)

| Commit (latest first) | Summary |
|---|---|
| `6161ff3` | Add hovering AI chatbot widget with lead capture across all pages |
| `542630a` | Add AI-image promo slider, blog with content, and brand avatar across site |
| `464eeac` | Wire booking and contact forms to send real emails via FormSubmit |
| `bfaaa93` | Update turnaround time to 4–48hrs, expand partner list to 68 institutions, add team gallery slider |
| `c711525` | About: feature Links logo beside Mission & Vision |
| `f632274` | Use official Links logo PNG across site |
| `e7c691e` | Links Valuers & Assessors website — full multi-page redesign (initial build) |

---

## 11. Where To Go Next

- **General quick-start / dev setup** → `README.md`
- **Chatbot widget deep-dive (editing answers, lead flow, etc.)** → `CHATBOT.md`
- **This file** → the single source of truth for overall project state

*Last updated: June 16, 2026.*
