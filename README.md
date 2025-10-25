# 🦒 NVC Learning Platform

An interactive web application for learning **Non-Violent Communication (NVC)** - a compassionate communication framework by Marshall Rosenberg.

![Status](https://img.shields.io/badge/status-beta-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## About NVC

Non-Violent Communication is a framework for empathetic, compassionate communication. It consists of **4 core pillars**:

1. **Observation** - Facts without judgment
2. **Feeling** - Naming actual emotions
3. **Need** - Identifying universal human needs
4. **Request** - Making concrete, actionable requests

This app teaches all 4 pillars through interactive lessons and AI-powered roleplay scenarios.

---

## Features

✨ **Interactive Lessons** - Learn the 4 NVC components step-by-step
✨ **Quizzes** - Test your understanding after each lesson
✨ **AI Roleplay** - Practice NVC in realistic conversations (coming soon)
✨ **Real-time Scoring** - Get feedback on your NVC responses
✨ **Dark Mode** - Learn comfortably day or night
✨ **Mobile Responsive** - Learn on any device

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | TanStack Start + React + TypeScript + Tailwind CSS |
| **Backend** | Convex (serverless database & functions) |
| **AI** | Claude (via Anthropic API) |
| **Hosting** | Cloudflare Pages (frontend) + Convex Cloud (backend) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nvc-learning-platform.git
cd nvc-learning-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will start at `http://localhost:3000`

### Development Server

```bash
npm run dev
```

This runs:
- Vite dev server (frontend)
- Convex dev server (backend)
- TypeScript compiler in watch mode

### Build for Production

```bash
npm run build
```

Creates optimized builds:
- `dist/client/` - Static frontend (deployable to Cloudflare Pages)
- `dist/server/` - Server code

---

## Deployment

### Quick Deploy (5 minutes)

See **[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)** for step-by-step instructions to deploy to Cloudflare Pages.

### Full Deployment Guide

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed deployment instructions, troubleshooting, and monitoring.

### Pre-Deployment Checklist

See **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** to verify everything is ready before deploying.

---

## Project Structure

```
├── src/
│   ├── routes/              # Page routes (TanStack Router)
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Home page
│   │   └── learn/           # Learning lessons
│   ├── components/          # Reusable React components
│   │   ├── ui/              # Generic UI components
│   │   ├── features/        # Feature-specific components
│   │   └── layout/          # Layout components
│   └── styles/              # Global styles
│
├── convex/
│   ├── schema.ts            # Database schema
│   ├── lessons.ts           # Lesson queries
│   ├── ai.ts                # Claude API integration
│   └── _generated/          # Auto-generated types (don't edit)
│
├── vite.config.ts           # Vite + TanStack Start config
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
└── wrangler.toml            # Cloudflare Pages config

See [PROJECT_SPEC.md](./PROJECT_SPEC.md) for full architecture details.
```

---

## Available Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run lint            # Run ESLint and TypeScript
npm run format          # Format code with Prettier
npm start               # Run production server (locally)
npm run dev:web         # Run frontend only
npm run dev:convex      # Run Convex backend only
npm run dev:ts          # Run TypeScript compiler watch
```

---

## Core Concepts

### Lessons

6 foundational lessons covering NVC:
1. **Introduction** - What is NVC and why it matters
2. **Observation** - Facts without judgment
3. **Feeling** - Real emotions vs pseudo-feelings
4. **Need** - Universal human needs
5. **Request** - Making effective requests
6. **Integration** - Putting it all together

### NVC Scoring

When users respond to scenarios, responses are analyzed and scored (0-100):

```
0-49   → Needs practice (mostly jackal language)
50-69  → Partial (some NVC components)
70-89  → Good (minor improvements possible)
90-100 → Excellent (pure giraffe language)
```

### Giraffe vs Jackal Language

- **Giraffe** 🦒 = Compassionate, empathetic NVC communication
- **Jackal** 🐕 = Judgmental, reactive communication

The app uses these symbols to help users distinguish healthy from unhealthy communication patterns.

---

## Configuration

### Environment Variables

Create `.env.local` (copy from `.env.example`):

```env
# Required for Convex
CONVEX_URL=https://your-deployment.convex.cloud

# Optional: Anthropic API key (for Convex functions)
ANTHROPIC_API_KEY=sk-...
```

**Note**: Never commit `.env.local` - it contains secrets!

### Convex Setup

Initialize Convex:
```bash
npx convex deploy
```

This sets up your Convex backend and generates types in `convex/_generated/`.

---

## Development Guidelines

See **[CLAUDE.md](./CLAUDE.md)** for detailed development guidelines covering:
- Code style preferences
- TypeScript conventions
- Convex patterns
- Component organization
- Error handling
- NVC principles in code

---

## Testing

### Run Tests
```bash
npm run test  # (when tests are added)
```

### Manual Testing Checklist

Before deploying, verify:
- [ ] All pages load without errors
- [ ] Navigation works between routes
- [ ] Lessons display all content
- [ ] Quizzes are functional
- [ ] No console errors (F12)
- [ ] Mobile responsive design works
- [ ] Convex API calls succeed

---

## Deployment Status

| Environment | Status | URL |
|-------------|--------|-----|
| Development | ✅ Running | `http://localhost:3000` |
| Production | ⏳ Ready to deploy | See [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) |

---

## Contributing

This is a learning project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please follow the guidelines in [CLAUDE.md](./CLAUDE.md) when contributing.

---

## License

MIT License - see LICENSE file for details

---

## Support & Resources

### Documentation
- **Project Spec**: [PROJECT_SPEC.md](./PROJECT_SPEC.md) - Complete requirements
- **Claude Guide**: [CLAUDE.md](./CLAUDE.md) - Development guidelines
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- **Quick Deploy**: [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) - 15-min deploy

### External Resources
- **NVC**: https://www.cnvc.org
- **TanStack Start**: https://tanstack.com/start
- **Convex**: https://docs.convex.dev
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/

### Get Help
1. Check the documentation files above
2. Search existing issues on GitHub
3. Create a new issue with details about the problem
4. Join the NVC community at https://www.cnvc.org

---

## Roadmap

### Phase 1 (Current) ✅
- Core lessons (6 foundational)
- Quiz functionality
- NVC scoring system

### Phase 2 (Next)
- AI-powered roleplay scenarios
- Conversation history & progress tracking
- User authentication

### Phase 3 (Future)
- Daily challenges & gamification
- User achievements & badges
- Community features (share responses)
- Multi-language support

---

## Acknowledgments

This project teaches the NVC framework created by **Marshall Rosenberg**. Learn more at https://www.cnvc.org

Built with ❤️ to help people communicate more compassionately.

---

**Ready to learn compassionate communication?** Start with the [Quick Start](./DEPLOYMENT_QUICK_START.md) guide or explore the [lessons](./src/routes/learn/).

🦒 Let's communicate with compassion and understanding.
