# Product

## Register

product

## Users

General self-improvers — adults curious about communication and personal growth, with little or no prior exposure to Non-Violent Communication (NVC). They arrive wanting to express themselves more honestly and listen better in everyday relationships (partners, family, friends, colleagues), not as clinicians or trained practitioners.

Their context is usually private and a little vulnerable: someone working through a difficult conversation, practicing a hard thing they're not yet good at, often on a phone, sometimes after a conflict. The job to be done: **learn the four NVC components, practice them in realistic roleplay, and build the confidence to use them in real life** — without feeling judged for getting it wrong.

## Product Purpose

An interactive platform that teaches NVC (Marshall Rosenberg's compassionate communication framework) through three connected experiences: bite-sized **lessons** on the four components (Observation, Feeling, Need, Request), **roleplay practice** with realistic characters plus instant scored feedback, and reinforcement loops (daily challenges, a feelings library, progress tracking).

Success looks like a user who keeps coming back, moves from "mostly jackal" toward "mostly giraffe" in their scored responses, and ultimately carries the practice into real conversations. The product wins when people feel safe enough to keep practicing the thing they're bad at.

## Brand Personality

**Warm, gentle, wise** — like a kind mentor who has all the time in the world for you. Patient and reassuring; it leads without lecturing. The giraffe guide is a companion, not a cartoon.

- **Voice**: encouraging, specific, growth-oriented. Names what's working before what to improve. Never moralizing.
- **Tone**: calm and unhurried. Emotionally safe space for vulnerability and mistakes.
- **Emotional goal**: the user should feel *safe* above all — safe to be honest, safe to fail, safe to try again.
- **Three words**: Warm. Gentle. Wise.

Note: per project convention, the UI never uses emojis and never references "AI" / artificial intelligence — the experience is framed as a guide and conversation partner, not a machine.

## Anti-references

This should NOT look or feel like:

- **Clinical / therapy-app sterility** — cold blue-and-white "mental health SaaS," medical, distancing. NVC is intimate; the UI must feel human and warm.
- **Childish / cartoonish** — over-the-top mascots, comic fonts, primary-color overload. The giraffe is a gentle guide, not a kids'-app sticker. Warmth, not whimsy-overload.
- **Corporate / LinkedIn** — stiff, jargon-heavy, gray-and-navy enterprise training modules. This is personal growth, not compliance training.
- **Preachy / judgmental** — self-righteous, moralizing, "you did this wrong." NVC is built on non-judgment; the interface must embody what it teaches.

## Design Principles

1. **Practice what you preach.** The interface must embody NVC: non-judgmental feedback, observations over evaluations, encouragement over criticism. Error and "low score" states are the highest-stakes moments — they must feel kind, never punishing.
2. **Safety before delight.** Calm pacing, gentle motion, and warmth come first. Celebration and play are welcome, but never at the cost of making a vulnerable user feel rushed, graded, or judged.
3. **Warm, not childish; gentle, not clinical.** Hold the narrow middle: human and approachable without tipping into cartoon, mature and credible without going cold. The giraffe leads; it does not clown.
4. **Show growth, not grades.** Frame progress as a journey moving from jackal toward giraffe. Emphasize movement and what's improving, de-emphasize absolute scores and failure.
5. **Concrete and specific.** Like a good NVC observation, copy and feedback name the specific thing — clear, actionable, never vague praise or vague blame.

## Accessibility & Inclusion

- **Target: WCAG 2.1 AA.** Body text ≥4.5:1 contrast, large text ≥3:1, full keyboard navigation, visible focus states, screen-reader labels on interactive elements and meaningful imagery.
- **Reduced motion is required.** Every animation (celebrations, confetti, milestone pings, reveals) needs a `prefers-reduced-motion: reduce` alternative. The codebase already honors this; keep it that way.
- **Emotional accessibility.** Users may be emotionally raw. Avoid jarring motion, alarming colors for "low" feedback (the warm coral `--color-empathy-low` is intentional — not a harsh red), and any framing that reads as failure.
- **No dark mode required** (per project convention).
- Light-on-warm contrast is the main risk in this palette: muted brown text on cream must stay above AA. Verify, don't assume.
