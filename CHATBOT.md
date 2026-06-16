# Links Assistant — Chatbot Widget

> Documentation for the hovering chatbot added to every page of the Links Valuers
> website. Written so a non-developer can understand what it does and make basic
> edits, and so a future developer can pick up maintenance without re-deriving
> the design.

---

## What It Is

A floating chat widget that appears on **all 9 pages** of the site (bottom-left
corner, opposite the WhatsApp button). It uses the "Links ChatBot" avatar
character as its face and does two things:

1. **Answers common questions** instantly, using simple keyword matching against
   a built-in knowledge base — no AI API, no backend server, no ongoing cost.
2. **Collects visitor contact details** after their first exchange, and emails
   them straight to **info@linksvaluers.com** so the team can follow up.

It is intentionally **rule-based, not a real AI/LLM chatbot**. The site is fully
static (HTML/CSS/JS, hosted on GitHub Pages) with no server to call an AI API
from securely, so a keyword-matched FAQ bot was the right-sized solution —
fast, free, fully under your control, and easy to edit without code experience.

---

## Where It Lives

| File | What's in it |
|---|---|
| `js/main.js` | All chatbot logic — knowledge base, quick replies, lead form, FormSubmit submission. Search for `/* ---------- Chatbot widget ---------- */`. |
| `css/styles.css` | All chatbot styling. Search for `CHATBOT WIDGET`. |
| Every `.html` page | A small markup block (`<!-- LINKS CHATBOT -->`) right before `<script src="js/main.js"></script>`, identical on every page. |
| `images/Avatar/Links ChatBot.png` | The avatar image used as the bot's face throughout. |

Because the markup, CSS, and JS are shared identically across every page, you
only ever need to edit **one file** (`js/main.js`) to change what the bot says
everywhere.

---

## How a Conversation Flows

1. Visitor clicks the pulsing avatar bubble (bottom-left) → panel opens.
2. Bot sends a greeting + 4 quick-reply buttons:
   - *How long does a valuation take?*
   - *What services do you offer?*
   - *Where are your branches?*
   - *Book a valuation*
3. Visitor clicks a chip or types a free-text question.
4. The bot checks the question against the knowledge base (see below) and
   replies. If nothing matches, it gives a graceful fallback pointing to phone
   / WhatsApp instead of guessing.
5. **After the first answer**, the bot asks once: *"Would you like a specialist
   to follow up directly? Leave your details and we'll reach out."* with a
   small inline form (name + phone/email) and a "Maybe later" skip button.
6. If they submit, their name, contact, last question, and the page they were
   on are emailed to **info@linksvaluers.com** (see Lead Capture below).
7. Whether they submit or skip, the bot won't ask again in that browser
   session (skip) or ever again on that device (submit) — see Persistence.

---

## The Knowledge Base (editing what the bot knows)

Open `js/main.js` and find the `KB` array inside the chatbot section. Each
entry looks like this:

```js
{ keys: ['turnaround', 'how long', 'fast', 'delivery'], a: 'Most valuations are delivered within <b>4–48 hours</b> of inspection.' }
```

- **`keys`** — a list of words/phrases. If the visitor's message contains *any*
  of these (case-insensitive, anywhere in the sentence), this entry's answer
  is used. The list is checked top-to-bottom — the first matching entry wins.
- **`a`** — the answer shown in the chat bubble. Basic HTML is allowed
  (`<b>bold</b>`, `<a href="...">links</a>`) since this is small in scope and
  trusted content you control.

**To add a new question the bot can answer**, add a new entry to the array,
e.g.:

```js
{ keys: ['rwanda', 'uganda', 'outside kenya'], a: 'Currently Links operates within Kenya only, across our 25 branches.' },
```

**To change an existing answer**, just edit the `a` text on that entry.

**Current topics covered:** turnaround time, pricing, services offered,
branches/locations, booking, required documents, licensing (M.A.A.K / I.R.A),
general contact info, greetings, and "thank you."

### Quick-reply chips

The 4 starter buttons live just below the `KB` array, in `QUICK_REPLIES`:

```js
var QUICK_REPLIES = [
  'How long does a valuation take?',
  'What services do you offer?',
  'Where are your branches?',
  'Book a valuation'
];
```

Each one is just plain text that gets "asked" automatically when clicked, so
it's matched against the same `KB` array above. Add, remove, or reorder freely
— just make sure the wording still matches a `keys` entry, or it'll fall
through to the generic fallback.

---

## Lead Capture (how visitor details reach you)

- The inline lead form (name + phone/email) submits via a background request
  to **FormSubmit** (`https://formsubmit.co/info@linksvaluers.com`) — the same
  no-signup email-forwarding service already used by the Book a Valuation and
  Contact forms on this site.
- Each submission includes: visitor's name, their phone/email, their **last
  question asked**, and the **page URL** they were chatting from — so you know
  exactly what they were interested in and where.
- ⚠️ **One-time setup step**: the *very first* chatbot lead ever submitted
  triggers a one-time "Activation Required" confirmation email from FormSubmit
  to **info@linksvaluers.com**. Someone needs to open that email and click the
  confirmation link once — after that, every future submission (from the
  chatbot, the booking form, and the contact form, since they all point to the
  same address) delivers automatically. If this was already done for the
  other two forms, nothing further is needed.

### Persistence (not re-asking the same visitor)

- If a visitor **submits** their details, a flag is saved in their browser's
  `localStorage` (`linksChatLeadCaptured`) so the bot never asks again on that
  device — even on a future visit.
- If a visitor clicks **"Maybe later"**, a flag is saved in `sessionStorage`
  (`linksChatLeadSkipped`) so it won't re-ask again for the rest of that
  browsing session, but it will ask again if they come back another day.
- This is all stored locally in the visitor's own browser — Links does not
  receive or store anything until a visitor actively submits the lead form.

---

## Design Notes

- **Placement**: bottom-left, so it never overlaps the existing WhatsApp
  button (bottom-right).
- **Avatar choice**: only `images/Avatar/Links ChatBot.png` is used — the
  other avatar file (`Links Bot.png`) has "R245,000" baked into the artwork
  (South African Rand), which doesn't match Kenya's KES market, so it was
  deliberately excluded from the chatbot and the rest of the site.
- **No external dependencies**: built in plain vanilla JavaScript, consistent
  with the rest of the site (mobile menu, FAQ accordion, sliders, counters are
  all hand-rolled the same way) — nothing to install, update, or pay for.
- **Typing indicator**: the three-dot "typing…" animation before each bot
  reply is purely cosmetic (a short randomized delay), to make the exchange
  feel more natural.

---

## Known Limitations

- It cannot understand questions outside its knowledge base — it matches
  keywords, not meaning. A question phrased very differently from anything in
  `KB` will fall through to the generic "call us / WhatsApp us" fallback.
- It does not remember a conversation across page reloads or between pages —
  each page load starts a fresh chat (though the lead-captured/skipped flags
  do persist, so it won't re-prompt the same visitor for details repeatedly).
- It does not integrate with a CRM — leads currently arrive as plain emails.
  If you later want them logged into HubSpot, Notion, or a spreadsheet
  automatically, that would need a small backend (e.g. a Zapier/Make
  automation watching the inbox, or a proper form-to-CRM integration) added on
  top of this.

---

## Possible Future Upgrades

- Swap the rule-based engine for a real AI model (e.g. via a small serverless
  function calling Claude/GPT) if you want it to handle open-ended questions
  — this would require adding a backend, which the site doesn't currently have.
- Persist chat history across pages within a visit using `sessionStorage`, so
  navigating the site doesn't reset the conversation.
- Auto-open the widget after N seconds on key pages (e.g. Book a Valuation) to
  proactively offer help, rather than waiting for the visitor to click it.

---

*Last updated: June 16, 2026.*
