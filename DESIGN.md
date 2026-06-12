---
name: NVC Learning Platform
description: A warm, gentle, judgment-free space for practicing compassionate communication.
colors:
  giraffe-gold: "#F5B841"
  giraffe-gold-deep: "#E0A030"
  giraffe-gold-text: "#A67218"
  giraffe-tint-50: "#FFF4D6"
  giraffe-tint-100: "#FFEDB3"
  giraffe-tint-200: "#FFE390"
  bark-brown: "#2D1E11"
  bark-brown-strong: "#1A110A"
  bark-brown-700: "#3D2817"
  bark-brown-600: "#573619"
  bark-brown-400: "#8B6F47"
  bark-brown-200: "#D4C2A0"
  soft-cream: "#F5F3E8"
  surface-white: "#FFFFFF"
  gentle-coral: "#E07856"
  growth-green: "#7FB069"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  md: "0.5rem"
  xl: "1rem"
  bubble: "1.5rem"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.giraffe-gold}"
    textColor: "{colors.bark-brown}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.giraffe-gold-deep}"
    textColor: "{colors.bark-brown}"
  button-secondary:
    backgroundColor: "{colors.bark-brown-600}"
    textColor: "{colors.soft-cream}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.bark-brown-700}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    textColor: "{colors.giraffe-gold-text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.bark-brown}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  badge-default:
    backgroundColor: "{colors.giraffe-tint-100}"
    textColor: "{colors.bark-brown}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: NVC Learning Platform

## 1. Overview

**Creative North Star: "The Patient Mentor"**

This is the interface of a kind guide who has all the time in the world for you. Everything about it is warm, unhurried, and wise. The palette is honeyed gold and soft earth-brown over a calm cream ground — the colors of a giraffe's world at low sun, never literal safari cartoon. The user arrives here to practice something they are not yet good at, often after a hard conversation, frequently a little raw. The system's entire job is to make that feel safe. Generous space, soft edges, gentle motion, and feedback that names what is working before what to improve.

The defining discipline is restraint in the service of calm. Surfaces are mostly flat; depth comes from warm tonal layering (a `giraffe-tint-50` panel inside a white card) and quiet borders, not from drop shadows competing for attention. There is exactly one display family — the system sans — carrying everything from hero to caption, because a product that teaches presence should not shout in three typefaces. Color is committed where it counts (a gold primary action, a coral that signals "keep practicing" without ever alarming) and absent everywhere else.

This system explicitly rejects four things, drawn straight from the product's anti-references. It is **not clinical** — no cold blue-and-white mental-health-SaaS sterility; warmth is non-negotiable. It is **not childish** — the giraffe is a gentle guide, not a sticker; no comic fonts, no primary-color overload. It is **not corporate** — no gray-and-navy enterprise training-module stiffness. And it is **not preachy** — the interface embodies the non-judgment it teaches, especially in its lowest-score and error states, which are the highest-stakes moments in the whole product.

**Key Characteristics:**
- Warm earth palette: giraffe gold, bark brown, soft cream — zero cool grays in the core system.
- Flat by default; depth via tonal tint layering and 1–2px borders, not shadows.
- One sans family across the entire hierarchy; weight and size carry contrast.
- Gentle, fixed-radius geometry (8px on cards and buttons, pills on badges and nav).
- Feedback is growth-framed: movement from jackal toward giraffe, never a verdict.
- Emotional safety leads every decision — calm pacing, soft signals, reduced-motion honored.

## 2. Colors

A warm, committed earth palette: one gold carries identity and action, brown carries all text and grounding, cream carries the ground, and two gentle signal colors carry feedback. No cool neutrals belong in the core system.

### Primary
- **Giraffe Gold** (#F5B841): The brand anchor and the only primary-action color. Fills primary buttons (with bark-brown text on top), drives the active nav pill, and marks current selection. This is the warmth of the whole system — used with intent, not as decoration.
- **Giraffe Gold Deep** (#E0A030): The hover and pressed state of every gold surface. One notch richer, never darker-and-grayer.
- **Giraffe Gold Text** (#A67218): Gold rendered as *text* on light grounds (links, ghost-button labels, stat figures). The lighter gold tones fail contrast as text; this is the readable member of the family.

### Secondary
- **Bark Brown** (#2D1E11): The primary ink. All body copy and most headings. Warm near-black that reads softer than true black against cream. This is the workhorse text color.
- **Bark Brown Strong** (#1A110A): Reserved emphasis — the largest headings, a score figure that needs to land.
- **Bark Brown 600** (#573619): The secondary-button fill (with cream text), and the grounding mid-brown for less prominent headings.

### Tertiary
- **Soft Cream** (#F5F3E8): The page ground. Warm, low-glare, calming. Also the text color *on* dark brown surfaces (secondary buttons, future dark panels).
- **Surface White** (#FFFFFF): The content surface — cards, nav pill, speech bubbles — floating gently above the cream ground.
- **Giraffe Tint 50 / 100 / 200** (#FFF4D6 / #FFEDB3 / #FFE390): The tonal-layering ladder. Tint-50 fills card headers/footers and inset panels; tint-100 is the default card border and badge fill; tint-200 deepens hover borders. This ladder is how the flat system gets its depth.

### Neutral (signal)
- **Gentle Coral** (#E07856): The "keep practicing" / lower-empathy signal and the error tone. Critically, this is a *warm coral, never a harsh red* — a vulnerable user seeing low feedback must not be alarmed. Used at full strength for small marks and at `/20` opacity for backgrounds.
- **Growth Green** (#7FB069): The "you've got it" / high-empathy and success signal. Calm sage, not neon. Same `/20` background convention.

### Named Rules
**The One Gold Rule.** Giraffe Gold is the only color that initiates action. If a surface is gold, it is the primary thing to do on that screen, the current selection, or a positive signal — never a decoration. Two gold buttons competing on one screen means one of them is wrong.

**The No-Alarm Rule.** Feedback colors are warm and gentle by mandate. Gentle Coral (#E07856), never `red-500`/`red-600`, carries every "low," "error," and "needs work" state. The product teaches non-judgment; its colors may not flinch.

**The Warm-Only Rule.** The core system contains no cool grays. Borders, text, and dividers are brown or gold tints. Stray `slate-*`, `gray-*`, and off-palette `blue-*` are bugs, not choices (several currently leak in — see Don'ts).

## 3. Typography

**Display Font:** System sans stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, …`)
**Body Font:** Same system sans stack
**Label Font:** Same system sans stack

**Character:** One warm, neutral humanist-ish sans carries the entire interface. No display/body pairing, no custom webfont — a product about presence and clarity uses a single, fast, familiar voice and lets weight and size do the work. The result reads calm and unfussy; nothing competes with the user's own words.

### Hierarchy
- **Display** (700, 3rem desktop / steps up from ~2.25rem on mobile, line-height 1.1): Landing hero and the largest page titles only. Letter-spacing tightened slightly (-0.02em). Use `text-wrap: balance`.
- **Headline** (700, 2.25rem, line-height 1.2): Section headings ("What is Non-Violent Communication?"). The most common large type in the product.
- **Title** (700, 1.25–1.5rem, line-height 1.3): Card titles, panel headings, the EmpathyMeter label.
- **Body** (400, 1rem / 1.125rem for lead paragraphs, line-height 1.6): All prose and conversation text, in Bark Brown. Cap measure at 65–75ch; the existing `max-w-3xl/4xl` containers respect this.
- **Label** (500, 0.875rem / 0.75rem, line-height 1.4): Badges, nav links, stat rows, captions. Medium weight, sentence case.

### Named Rules
**The One Voice Rule.** One family, full stop. Hierarchy is built from weight (400 body, 500 label, 700 heading) and size on a calm ~1.2 scale — never from a second typeface. No display serif, no mono accent, no decorative font for "personality."

**The Sentence-Case Rule.** Headings and labels are sentence case. No all-caps tracked eyebrows above sections; that scaffolding reads as corporate and breaks the gentle voice.

## 4. Elevation

This is a **flat-by-default** system. Depth is conveyed first by warm tonal layering — a `giraffe-tint-50` header inside a `surface-white` card on a `soft-cream` page is three legible planes with not a single shadow — and second by quiet 1–2px tinted borders. Shadows are a faint accent reserved for genuinely floating elements, never a default applied to every card. When a shadow appears, it is soft, low, and warm-neutral; it should be felt, not seen.

### Shadow Vocabulary
- **Rest lift** (`box-shadow: 0 1px 2px rgba(45,30,17,0.06)` — Tailwind `shadow-sm`): The maximum elevation for an at-rest card or button. Barely-there separation from the cream ground.
- **Hover lift** (`shadow-md`, ~`0 4px 6px rgba(45,30,17,0.08)`): A gentle response to hover on interactive cards. Pairs with a border deepening from tint-100 to tint-200. State feedback, not decoration.
- **Floating** (`shadow-lg`): Reserved for elements that genuinely float above content — the FloatingNav pill, speech bubbles, dropdown menus. Not for in-flow cards.

### Named Rules
**The Tonal-First Rule.** Reach for a tint before a shadow. If two surfaces need separating, layer cream → white → tint-50 or add a tint border. A shadow is the last resort, allowed only when the element truly floats.

**The Flat-Rest Rule.** Surfaces are flat at rest (≤ `shadow-sm`). Elevation is a *response to state* (hover, open, float) — never the resting condition of an ordinary card.

## 5. Components

### Buttons
- **Shape:** Gently rounded (8px, `rounded-lg`). Consistent across every variant and size. Transitions are `transition-colors` at 200ms — color shifts, not movement.
- **Primary:** Giraffe Gold fill with **Bark Brown** text (the gold is too light for white text — brown-on-gold is the signature and it passes contrast). Hover → Giraffe Gold Deep. Disabled → giraffe-tint-200 at reduced opacity. Focus → 2px gold ring with offset.
- **Secondary:** Bark Brown 600 fill with Soft Cream text. Hover → brown-700. For the second action beside a primary.
- **Outline:** 2px Giraffe Gold border, Bark Brown 700 text, transparent fill; hover fills with giraffe-tint-50.
- **Ghost:** Giraffe Gold Text label, no border; hover fills giraffe-tint-100. For low-emphasis and inline actions.
- **Sizes:** sm (`px-3 py-1.5`, 0.875rem), md (`px-4 py-2`, 1rem), lg (`px-6 py-3`, 1.125rem).

### Badges / Chips
- **Style:** Full pill (`rounded-full`), medium-weight label, always with a 1px tinted border (the border is part of the identity — badges are never borderless fills).
- **Variants:** default & info (giraffe-tint-100 fill, bark-brown text), warning (giraffe-tint-50 fill, brown-700 text), success (growth-green at /20 fill and border), error (gentle-coral at /20 fill and border). Note success/error use the gentle signal colors — never saturated green/red.

### Cards / Containers
- **Corner Style:** 8px (`rounded-lg`).
- **Background:** Surface White on the cream ground.
- **Shadow Strategy:** `shadow-sm` at rest; `shadow-md` only on `hoverable` cards (see Elevation). Most cards stay flat.
- **Border:** 2px `giraffe-tint-100` — the warm border is doing the separation work, not a shadow. Headers and footers fill `giraffe-tint-50` with a tint-100 divider.
- **Internal Padding:** `px-6 py-4` (24px / 16px) standard.

### Inputs / Fields
- **Style:** White fill, warm tinted border (giraffe-tint-100/200), 8px radius — matching card geometry.
- **Focus:** 2px Giraffe Gold ring with offset (the same focus treatment as buttons — one focus language across the system).
- **Error:** Gentle Coral border and a gentle-coral helper message. Never a harsh red outline; the message names the fix kindly.

### Navigation — The Floating Pill (signature)
- A fixed, centered (desktop) or top-right (mobile) pill: `surface-white/80` with `backdrop-blur-md`, full radius, soft `shadow-lg`, 1px giraffe-tint-200 border. This is the one sanctioned use of glass in the system — it floats over scrolling content and the blur keeps it legible. Active link → Giraffe Gold pill with brown text; inactive → brown text, hover fills giraffe-tint-50. (Current code uses `slate-600` for inactive labels — that is an off-palette leak; it should be `bark-brown-400`.)

### EmpathyMeter (signature)
- The product's emotional centerpiece: a horizontal 0–100 bar on a `bark-brown-200` track, fill colored by band — growth-green (≥90), gold (≥70), warm amber (≥50), soft orange (≥30), gentle-coral (below). The label frames the score as a stage on a journey ("Mix of giraffe & jackal"), never a grade. Fill animates width at 500ms ease-out; honors reduced-motion.

## 6. Do's and Don'ts

### Do:
- **Do** use Giraffe Gold (#F5B841) only for primary action, current selection, and positive signal — the One Gold Rule. One primary gold button per screen.
- **Do** put **Bark Brown text on gold** buttons and gold on light grounds via Giraffe Gold Text (#A67218). Verify body text hits ≥4.5:1 on cream — warm-on-warm is this palette's main contrast risk.
- **Do** convey depth with tonal tint layering (cream → white → tint-50) and warm borders before reaching for any shadow — the Tonal-First Rule.
- **Do** keep every "low score," "error," and "needs work" state in **Gentle Coral (#E07856)** — warm, never alarming. The No-Alarm Rule.
- **Do** frame all feedback as growth (jackal → giraffe), naming what works before what to improve.
- **Do** use one sans family; build hierarchy from weight and size. Sentence case for headings and labels.
- **Do** give every interactive element the same 8px geometry and the same 2px gold focus ring.
- **Do** provide a `prefers-reduced-motion: reduce` alternative for every animation (celebrations, confetti, the meter fill) — already honored in `app.css`; keep it that way.

### Don't:
- **Don't** introduce cool neutrals or off-palette colors. No `slate-*`, `gray-*`, or `blue-*` — they currently leak into FloatingNav (`text-slate-600`) and the landing NVC cards (`border-l-blue-500`). Replace with brown/gold tints. The Warm-Only Rule.
- **Don't** use `red-500`/`red-600` or any saturated red for errors or low scores. Gentle Coral only. A raw red on a vulnerable user is a product failure.
- **Don't** use side-stripe borders — `border-left`/`border-right` > 1px as a colored accent (the landing currently has `border-l-4 border-l-blue-500`). Rewrite with a full tinted border, a tint background, or a leading number. Forbidden.
- **Don't** use gradient text (`bg-clip-text text-transparent` over a gradient) — the landing hero currently does. Use a single solid color; emphasize with weight or size.
- **Don't** look clinical (cold blue/white therapy-SaaS), childish (comic fonts, primary-color overload, sticker-mascot), corporate (gray/navy training-module stiffness), or preachy (any framing that judges). These are PRODUCT.md's four anti-references; the visuals must hold the line.
- **Don't** add a second typeface or a tracked all-caps eyebrow above sections. One voice, sentence case.
- **Don't** apply shadows to ordinary at-rest cards. Elevation is a response to state or true floating only — the Flat-Rest Rule.
- **Don't** use glassmorphism decoratively. The FloatingNav pill is the single sanctioned glass surface; nowhere else.
