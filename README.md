# NVC Learning Platform

An interactive web app for learning and practising **Non-Violent Communication
(NVC)**, the compassionate-communication framework created by Marshall
Rosenberg. It combines short lessons, a feelings-vocabulary library, and, at
its core, realistic roleplay conversations where you rehearse hard
conversations and get warm, non-judgmental coaching on how you expressed
yourself.

## Why it exists

Most people first meet NVC in a book or a workshop and then freeze the moment
they try to use it in a real, emotionally charged conversation. This app closes
that gap. You learn the four components, then practise them safely against a
conversation partner that responds in character and opens up as your language
becomes more empathetic. You can also describe a real situation from your own
life and have a tailored partner generated, so you can rehearse a difficult
talk _before_ you have it for real, without ever feeling judged for getting it
wrong. It's aimed at anyone curious about communication and personal growth, no
prior NVC experience required.

## The four components of NVC

1. **Observation**: describing facts without judgment
2. **Feeling**: naming the actual emotion
3. **Need**: identifying the universal human need underneath the feeling
4. **Request**: making a concrete, doable request

The app frames the goal as moving from "jackal" language (judgmental, reactive)
toward "giraffe" language (empathetic, connecting).

## Features

- **Interactive lessons** on each of the four components, plus an introduction
  and an integration lesson, with examples and quizzes
- **Roleplay practice**: in-character conversations where the partner's
  openness scales with how empathetically you communicate, reaching a natural
  closing moment once you've expressed a feeling, a need and a request
- **Per-message coaching**: each message is scored on the four components
  (0-25 each, 0-100 total), with what went well, a single next-step hint, and
  gentle detection of "jackal" phrases
- **Custom scenario builder**: describe a real situation, answer a couple of
  clarifying questions, and get a practice partner tailored to it
- **Rewind** a conversation to try a different approach
- **Feelings system**: a feelings wheel, intensity, a browsable library, a
  daily check-in, and a quiz that distinguishes real feelings from
  pseudo-feelings
- **Daily challenges** with bonus points and streaks
- **Progress and gamification**: levels, points, stars, streaks, achievements,
  and a profile with skill stats and an activity feed

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | TanStack Start · React 19 · TypeScript · Tailwind CSS v4 |
| Backend | Convex (reactive database, queries, mutations, actions) |
| Auth | `@convex-dev/auth` (includes GitHub sign-in) |
| Language model | Anthropic Claude via `@anthropic-ai/sdk`, called only from Convex Actions |
| Hosting | Cloudflare Workers (SSR) · Convex Cloud (backend) |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run dev` runs a one-off Convex sync, then starts the Vite dev server and
the Convex backend together.

Copy `.env.example` to `.env.local` and set:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_URL=https://your-deployment.convex.cloud
```

The Claude API key is used by Convex actions, so it is set on the Convex
deployment (not in `.env.local`):

```bash
npx convex env set ANTHROPIC_API_KEY sk-ant-...
```

Set it separately for the dev and prod deployments. To seed a fresh
deployment:

```bash
npx convex run seed:seedAllFeelings
npx convex run scenarios:seedAll
npx convex run dailyChallenges:generateDailyChallenge
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start web + Convex dev servers |
| `npm run dev:web` | Frontend only |
| `npm run dev:convex` | Convex backend only |
| `npm run build` | Production build (`vite build && tsc --noEmit`) |
| `npm run lint` | ESLint + TypeScript |
| `npm run format` | Format with Prettier |
| `npm run preview` | Preview the production build |
| `npm run deploy` | Deploy Convex, then the Cloudflare Worker |
| `npm run cf-typegen` | Generate Cloudflare types |

## Deployment

```bash
npm run deploy
```

This deploys the Convex backend (`convex deploy`, which also runs the build) and
then the Cloudflare Worker (`wrangler deploy`). The frontend is served from
Cloudflare Workers and the reactive backend runs on Convex Cloud.

## Project structure

```
src/
  routes/        # Pages (TanStack Router): home, learn/, practice/, feelings/, profile
  components/    # ui/, features/, layout/
  styles/        # Global styles
convex/
  schema.ts      # Database schema (source of truth)
  ai.ts          # Claude integration (in-character replies + scoring)
  conversations.ts, dailyChallenges*.ts, crons.ts, ...
  _generated/    # Auto-generated types (don't edit)
```

See [`PROJECT_SPEC.md`](./PROJECT_SPEC.md) and the various `*_SPEC.md` files for
detailed design notes, and [`CLAUDE.md`](./CLAUDE.md) for development guidelines.

## Acknowledgments

This project teaches the NVC framework created by **Marshall Rosenberg**. Learn
more at <https://www.cnvc.org>.
